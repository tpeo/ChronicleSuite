import { createStyles, Space, Stack } from "@mantine/core";
import Chart from "../chart";

const useStyles = createStyles((theme, _params, getRef) => {
	return {
		Container: {
			padding: "20px",
		},
		Header: {
			fontSize: "10px",
			color: "gray",
		},
		ChartContainer: {
			width: "160px",
			height: "60px",
		},
	};
});

function SingleMetricDisplay(props) {
	const { classes } = useStyles();
	return (
		<Stack spacing="none" className={classes.Container}>
			<div className={classes.Header}>{props.name}</div>
			<div>{props.total}</div>
			<Space h="xs" />
			<div className={classes.ChartContainer}>
				<Chart data={props.data} keyName={props.keyName} compact />
			</div>
		</Stack>
	);
}

export default SingleMetricDisplay;
