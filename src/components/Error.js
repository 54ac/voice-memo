export default function Error(props) {
	const { error, notFound, support, permission } = props;
	if (notFound) {
		return "file not found";
	} else if (!support) {
		return "your browser does not seem to support audio recording";
	} else if (!permission) {
		return "waiting for audio recording permission (or permission not granted)";
	} else if (error) {
		return "something went wrong along the way";
	} else {
		return null;
	}
}
