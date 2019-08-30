import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

export default function Header(props) {
	const { playMode } = props;

	//add URL to main page if in playback mode
	return (
		<>
			<ListItem
				dense
				disableGutters
				className="MuiListItem-prod"
				style={{ justifyContent: "center" }}
			>
				{playMode ? (
					<a href="/">the voice memo repository</a>
				) : (
					"the voice memo repository"
				)}
			</ListItem>
			<Divider />
		</>
	);
}
