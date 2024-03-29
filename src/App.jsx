/* eslint-disable no-console */
import React, { Component } from "react";
import Paper from "@mui/material/Paper";
import {
	ThemeProvider,
	StyledEngineProvider,
	createTheme
} from "@mui/material/styles";
import List from "@mui/material/List";
import { v4 as uuidv4 } from "uuid";
import Error from "./components/Error";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RecButton from "./components/RecButton";
import PlayButton from "./components/PlayButton";
import UploadButton from "./components/UploadButton";
import EntryList from "./components/EntryList";

const theme = createTheme({
	typography: {
		fontFamily: ["Roboto Mono", "monospace"]
	},
	palette: {
		secondary: {
			main: "#f50057"
		},
		primary: {
			main: "#d5d5d5"
		}
	}
});

const timeStamp = (time) => new Date(1000 * time).toISOString().substr(15, 4);

export default class App extends Component {
	constructor(props) {
		super(props);
		this.record = this.record.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.playAudio = this.playAudio.bind(this);
		this.stopAudio = this.stopAudio.bind(this);
		this.upload = this.upload.bind(this);
		this.deleteFile = this.deleteFile.bind(this);
		this.state = {
			recording: false,
			support: false,
			permission: false,
			blob: false,
			playing: false,
			duration: 0,
			remaining: 0,
			recRemaining: 300.1,
			recRemainingDefault: 300.1,
			files: [],
			playMode: false,
			error: false,
			uploaded: false,
			copied: false,
			notFound: false,
			deleting: false
		};
	}

	componentDidMount() {
		const playMode = new URLSearchParams(window.location.search).get("play");
		if (playMode) {
			// support and permission not necessary so just set them to true as a workaround
			this.setState({ playMode, support: true, permission: true });
			this.initAudio();
			fetch("api/play/" + playMode)
				.then((response) => {
					if (response.status === 404) {
						this.setState({ notFound: true });
						return;
					}
					// this is from some official mozilla example
					const reader = response.body.getReader();
					return new ReadableStream({
						start(controller) {
							return pump();
							function pump() {
								return reader.read().then(({ done, value }) => {
									if (done) {
										controller.close();
										return;
									}
									controller.enqueue(value);
									return pump();
								});
							}
						}
					});
				})
				.then((stream) => new Response(stream))
				.then((response) => response.blob())
				.then((blob) =>
					this.setState({ blob }, () => {
						this.audio.src = window.URL.createObjectURL(this.state.blob);
					})
				)
				.catch((err) => {
					console.error(err);
					this.setState({ error: true });
				});
		}

		if (!playMode) {
			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				this.setState({ support: true });
				navigator.mediaDevices
					.getUserMedia({
						audio: true
					})
					.then((stream) => {
						this.setState({ permission: true });

						if (!localStorage.getItem("uuid"))
							localStorage.setItem("uuid", uuidv4());

						this.uuid = localStorage.getItem("uuid");

						fetch("api/list/" + this.uuid)
							.then((res) => res.json())
							.then((json) => this.setState({ files: json.files }))
							.catch((err) => {
								console.error(err);
								this.setState({ error: true });
							});

						this.initAudio();
						this.initRecord(stream);
					})
					.catch((err) => {
						this.setState({ error: true });
						console.error(err);
					});
			} else {
				this.setState({ error: true });
			}
		}
	}

	initAudio() {
		this.audio = new Audio();

		this.audio.ondurationchange = async () => {
			// chrome bug workaround
			while (this.audio.duration === Infinity) {
				await new Promise((r) => setTimeout(r, 1000));
				this.audio.currentTime = 10000000 * Math.random();
			}
			this.setState({
				duration: this.audio.duration
			});
		};

		this.audio.ontimeupdate = () => {
			this.setState({
				remaining: this.audio.duration - this.audio.currentTime
			});
		};

		this.audio.onended = () => {
			this.setState({ playing: false });
		};
	}

	initRecord(stream) {
		this.mediaRecorder = new MediaRecorder(stream);
		this.chunks = [];

		this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);

		this.mediaRecorder.onstop = () => {
			const blob = new Blob(this.chunks, {
				type: "audio/ogg"
			});
			if (blob)
				this.setState({ blob }, () => {
					this.audio.src = window.URL.createObjectURL(this.state.blob);
				});
			this.chunks = [];
		};
	}

	record() {
		this.mediaRecorder.start();
		this.setState({
			recording: true,
			blob: false,
			uploaded: false,
			duration: 0,
			remaining: 0
		});
		this.interval = setInterval(() => {
			this.setState((prev) => ({ recRemaining: prev.recRemaining - 0.5 }));
		}, 500);
		setTimeout(() => {
			this.stopRecording();
		}, this.state.recRemainingDefault * 1000);
	}

	stopRecording() {
		this.mediaRecorder.stop();
		clearInterval(this.interval);
		this.setState((prev) => ({
			recording: false,
			recRemaining: prev.recRemainingDefault
		}));
	}

	playAudio() {
		this.audio.play();
		this.setState({
			playing: true
		});
	}

	stopAudio() {
		this.audio.pause();
		this.audio.currentTime = 0;
		this.setState({ playing: false });
	}

	upload() {
		this.setState({ uploading: true });
		const body = new FormData();
		body.append("recording", this.state.blob);
		fetch("api/upload/" + this.uuid, {
			method: "POST",
			body
		})
			.then((res) => res.json())
			.then((json) => {
				this.setState({
					files: json.files,
					uploading: false,
					uploaded: true
				});
			})
			.catch((err) => {
				console.error(err);
				this.setState({ error: true });
			});
	}

	deleteFile(filename) {
		this.setState({ deleting: true });
		fetch("api/delete/" + this.uuid + "/" + filename, { method: "POST" })
			.then((res) => res.json())
			.then((json) => this.setState({ files: json.files, deleting: false }))
			.catch((err) => {
				console.error(err);
				this.setState({ error: true });
			});
	}

	render() {
		const {
			recording,
			support,
			permission,
			blob,
			playing,
			duration,
			remaining,
			recRemaining,
			files,
			playMode,
			error,
			uploading,
			uploaded,
			copied,
			notFound,
			deleting
		} = this.state;
		return (
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<div className="App">
						<Paper className="MuiPaper-prod">
							{error || !support || !permission || notFound ? (
								<a href="/">
									<Error
										error={error}
										support={support}
										permission={permission}
										notFound={notFound}
									/>
								</a>
							) : (
								<List className="MuiList-prod" dense disablePadding>
									<Header playMode={playMode} />
									{!playMode && (
										<RecButton
											recording={recording}
											blob={blob}
											recRemaining={recRemaining}
											record={this.record}
											timeStamp={timeStamp}
											stopRecording={this.stopRecording}
										/>
									)}
									<PlayButton
										playing={playing}
										blob={blob}
										remaining={remaining}
										duration={duration}
										playAudio={this.playAudio}
										stopAudio={this.stopAudio}
										timeStamp={timeStamp}
									/>
									{!playMode && (
										<>
											<UploadButton
												blob={blob}
												uploading={uploading}
												uploaded={uploaded}
												upload={this.upload}
											/>

											{files.length > 0 && (
												<EntryList
													files={files}
													copied={copied}
													deleteFile={this.deleteFile}
													deleting={deleting}
												/>
											)}
										</>
									)}
									<Footer />
								</List>
							)}
						</Paper>
					</div>
				</ThemeProvider>
			</StyledEngineProvider>
		);
	}
}
