import React, { Component } from "react";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import copy from "clipboard-copy";
import EntryButton from "./EntryButton";

export default class EntryList extends Component {
	constructor(props) {
		super(props);
		this.copyURL = this.copyURL.bind(this);
		this.state = {
			openSnackbar: false,
			copied: false
		};
	}

	handleCloseSnackbar = () => {
		this.setState({ openSnackbar: false });
	};

	copyURL(filename) {
		copy(window.location.origin + "?play=" + filename).then(
			this.setState({ copied: filename, openSnackbar: true })
		);
	}

	render() {
		const { files, deleteFile, deleting } = this.props;
		const { openSnackbar, copied } = this.state;
		return (
			<>
				<Divider />
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					autoHideDuration={3000}
					open={openSnackbar}
					onClose={this.handleCloseSnackbar}
					message={
						<span style={{ fontSize: "inherit" }}>
							link copied to clipboard
						</span>
					}
				/>
				{files.map(file => (
					<EntryButton
						key={file.filename}
						file={file}
						copyURL={this.copyURL}
						copied={copied}
						deleteFile={deleteFile}
						deleting={deleting}
					/>
				))}
			</>
		);
	}
}
