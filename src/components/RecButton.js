import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import StopIcon from "@material-ui/icons/Stop";
import RefreshIcon from "@material-ui/icons/Refresh";

export default function RecButton(props) {
	const { recording, blob, recRemaining, record, timeStamp, stopRecording } =
		props;

	return (
		<ListItem className="MuiListItem-prod" style={{ justifyContent: "center" }}>
			{!recording ? (
				<Button
					variant="contained"
					color="secondary"
					className="MuiButton-prod"
					style={{ justifyContent: "space-between" }}
					onClick={() => record()}
				>
					{!blob ? (
						<FiberManualRecordIcon
							fontSize="inherit"
							shapeRendering="geometricPrecision"
						/>
					) : (
						<RefreshIcon
							fontSize="inherit"
							shapeRendering="geometricPrecision"
						/>
					)}
					{`${blob ? "re" : ""}record (-${timeStamp(recRemaining)})`}
					<span />
				</Button>
			) : (
				<Button
					variant="contained"
					className="MuiButton-prod"
					style={{ justifyContent: "space-between" }}
					onClick={() => stopRecording()}
				>
					<StopIcon fontSize="inherit" shapeRendering="geometricPrecision" />
					{`stop (-${timeStamp(recRemaining)})`}
					<span />
				</Button>
			)}
		</ListItem>
	);
}
