import React from "react";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";

export default function Footer() {
	return (
		<>
			<Divider />
			<ListItem
				dense
				disableGutters
				className="MuiTypography-prod"
				style={{ justifyContent: "center" }}
			>
				This is a demo of&nbsp;
				<a
					target="_blank"
					rel="noreferrer noopener"
					href="https://github.com/54ac/voice-memo"
				>
					this GitHub repo
				</a>
				.
			</ListItem>
			<ListItem
				dense
				disableGutters
				className="MuiTypography-prod"
				style={{ justifyContent: "center" }}
			>
				It is not meant for commercial use (or any use, really).
			</ListItem>
		</>
	);
}
