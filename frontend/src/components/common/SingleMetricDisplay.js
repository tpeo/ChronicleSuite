import { Stack } from "@mantine/core";

function SingleMetricDisplay(props) {
	return (
		<Stack spacing="xs" style={{ width: "160px", padding: "10px", borderRadius: "20px", border: "2px solid black" }}>
			<div>{props.name}</div>
			<div>{props.data}</div>
		</Stack>
	);
}

export default SingleMetricDisplay;
