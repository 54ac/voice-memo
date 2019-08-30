import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

export default function Footer() {
	return (
		<>
			<Divider />
			<ListItem
				dense
				disableGutters
				className="MuiListItem-prod"
				style={{ justifyContent: "center" }}
			>
				2019
			</ListItem>
		</>
	);
}
