import React from "react";
import ListItem from "@mui/material/ListItem";
import CheckIcon from "@mui/icons-material/Check";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import moment from "moment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";

export default function EntryButton(props) {
	const { file, copyURL, copied, deleteFile, deleting } = props;

	return (
		<ListItem
			key={file.filename}
			className="MuiListItem-prod"
			style={{ justifyContent: "center" }}
		>
			<ListItemIcon className="MuiListItemIcon-prod">
				<IconButton
					onClick={() => {
						copyURL(file.filename);
					}}
					disabled={deleting}
					size="small"
				>
					{copied === file.filename ? (
						<CheckIcon fontSize="small" shapeRendering="geometricPrecision" />
					) : (
						<FileCopyIcon
							fontSize="small"
							shapeRendering="geometricPrecision"
						/>
					)}
				</IconButton>
			</ListItemIcon>
			<ListItemText
				className="MuiListItemText-prod"
				primaryTypographyProps={{ className: "MuiTypography-prod" }}
			>
				{moment(file.date).calendar().toLocaleLowerCase()}
			</ListItemText>
			<ListItemIcon className="MuiListItemIcon-prod">
				{deleting ? (
					<CircularProgress color="inherit" size="0.75rem" />
				) : (
					<IconButton
						onClick={() => {
							deleteFile(file.filename);
						}}
						size="small"
					>
						<DeleteForeverIcon
							fontSize="small"
							shapeRendering="geometricPrecision"
						/>
					</IconButton>
				)}
			</ListItemIcon>
		</ListItem>
	);
}
