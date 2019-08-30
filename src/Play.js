import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import StopIcon from "@material-ui/icons/Stop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import RefreshIcon from "@material-ui/icons/Refresh";
import moment from "moment";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import copy from "clipboard-copy";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";

const theme = createMuiTheme({
	typography: {
		fontFamily: "'Roboto Mono', monospace"
	}
});

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
		const {
			recording,
			support,
			permission,
			blob,
			playing,
			duration,
			remaining,
			recRemaining,
			files
		} = this.state;
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
