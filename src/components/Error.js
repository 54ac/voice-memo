export default function Error(props) {
	const { error, notFound, support, permission } = props;
	if (notFound) {
		return "file not found";
	}
	if (!support) {
		return "your browser does not seem to support audio recording";
	}
	if (!permission) {
		return "waiting for audio recording permission (or permission not granted)";
	}
	if (error) {
		return "something went wrong along the way";
	}
	return null;
}
