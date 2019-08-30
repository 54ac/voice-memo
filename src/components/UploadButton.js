import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";

export default function UploadButton(props) {
	const { blob, uploaded, uploading, upload } = props;

	return (
		<ListItem className="MuiListItem-prod" style={{ justifyContent: "center" }}>
			<Button
				className="MuiButton-prod"
				variant="contained"
				style={{ justifyContent: "space-between" }}
				onClick={() => {
					upload();
				}}
				disabled={!blob || uploaded || uploading}
			>
				{uploading ? (
					<>
						<CircularProgress color="inherit" size="0.75rem" />
						{" uploading"}
					</>
				) : (
					<>
						<CloudUploadIcon
							fontSize="inherit"
							shapeRendering="geometricPrecision"
						/>
						{uploaded ? "uploaded" : "upload"}
					</>
				)}
				<span />
			</Button>
		</ListItem>
	);
}
