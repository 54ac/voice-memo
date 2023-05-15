import React from "react";
import ListItem from "@material-ui/core/ListItem";
import CheckIcon from "@material-ui/icons/Check";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import moment from "moment";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";

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
