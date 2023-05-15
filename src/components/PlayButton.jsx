import React from "react";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function PlayButton(props) {
	const {
		playing,
		blob,
		remaining,
		duration,
		playAudio,
		stopAudio,
		timeStamp
	} = props;

	return (
		<ListItem className="MuiListItem-prod" style={{ justifyContent: "center" }}>
			{!playing ? (
				<Button
					variant="contained"
					className="MuiButton-prod"
					style={{ justifyContent: "space-between" }}
					onClick={() => playAudio()}
					disabled={!blob}
				>
					<PlayArrowIcon
						fontSize="inherit"
						shapeRendering="geometricPrecision"
					/>
					{`play (${timeStamp(remaining || duration)})`}
					<span />
				</Button>
			) : (
				<Button
					variant="contained"
					className="MuiButton-prod"
					style={{ justifyContent: "space-between" }}
					onClick={() => stopAudio()}
				>
					<StopIcon fontSize="inherit" shapeRendering="geometricPrecision" />
					{`stop (-${timeStamp(remaining || duration)})`}
					<span />
				</Button>
			)}
		</ListItem>
	);
}
