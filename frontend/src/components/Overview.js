import { Center, createStyles, Grid, Stack } from "@mantine/core";
import Dashboard from "./common/Dashboard.js";
import SingleMetricDisplay from "./common/SingleMetricDisplay.js";
import * as constants from "../_helpers/constants.js";

const useStyles = createStyles((theme, _params, getRef) => {
	return {
		Container: {
			margin: "20px",
		},
	};
});

function Overview(props) {
	const { classes } = useStyles();

	return (
		<div className={classes.Container}>
			<Stack>
				<Center>
					<Grid gutter="xl">
						<Grid.Col span="content">
							<SingleMetricDisplay name="Impressions" data={constants.data.reduce((sum, d) => sum + d.impressions, 0)} />
						</Grid.Col>
						<Grid.Col span="content">
							<SingleMetricDisplay name="Posts" data={constants.data.length} />
						</Grid.Col>
					</Grid>
				</Center>
				<Center>
					<Dashboard />
				</Center>
			</Stack>
		</div>
	);
}

export default Overview;
