import React, { Component } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Redirect } from "react-router";
export default class Play extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blob: false,
			playing: false,
			duration: 0,
			remaining: 0
		};
	}

	componentDidMount() {
		this.audio = new Audio();

		this.audio.ondurationchange = () => {
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

	timeStamp(time) {
		return new Date(1000 * time).toISOString().substr(15, 4);
	}

	render() {
		const { blob, playing, duration, remaining } = this.state;
		return this.props.match.params.id ? (
			<Paper className="MuiPaper-prod">
				<List className="MuiList-prod" dense disablePadding>
					<ListItem
						dense
						disableGutters
						className="MuiListItem-prod"
						style={{ justifyContent: "center" }}
					>
						online voice memo thing
					</ListItem>
					<Divider />

					<ListItem
						className="MuiListItem-prod"
						style={{ justifyContent: "center" }}
					>
						{!playing ? (
							<Button
								variant="contained"
								className="MuiButton-prod"
								style={{ justifyContent: "space-between" }}
								onClick={() => this.playAudio()}
								disabled={!blob}
							>
								<PlayArrowIcon
									fontSize="inherit"
									shapeRendering="geometricPrecision"
								/>
								{`Play (${this.timeStamp(remaining || duration)})`}
								<span />
							</Button>
						) : (
							<Button
								variant="contained"
								className="MuiButton-prod"
								style={{ justifyContent: "space-between" }}
								onClick={() => this.stopAudio()}
							>
								<StopIcon
									fontSize="inherit"
									shapeRendering="geometricPrecision"
								/>
								{`Stop (-${this.timeStamp(remaining || duration)})`}
								<span />
							</Button>
						)}
					</ListItem>

					<Divider />
					<ListItem
						dense
						disableGutters
						className="MuiListItem-prod"
						style={{ justifyContent: "center" }}
					>
						2019
					</ListItem>
				</List>
			</Paper>
		) : (
			<Redirect to="/" />
		);
	}
}
