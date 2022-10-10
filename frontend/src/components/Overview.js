import { Center, createStyles, Grid, Stack } from "@mantine/core";
import data from "../_helpers/fillerData.js";
import Dashboard from "./common/Dashboard.js";
import SingleMetricDisplay from "./common/SingleMetricDisplay.js";

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
							<SingleMetricDisplay name="Posts" data={data.posts} total={data.posts.reduce((sum, d) => sum + d.posts, 0)} keyName="posts" />
						</Grid.Col>
						<Grid.Col span="content">
							<SingleMetricDisplay
								name="Impressions"
								data={data.impressions}
								total={data.impressions.reduce((sum, d) => sum + d.impressions, 0)}
								keyName="impressions"
							/>
						</Grid.Col>
						<Grid.Col span="content">
							<SingleMetricDisplay
								name="Profile Visits"
								data={data.profileImpressions}
								total={data.profileImpressions.reduce((sum, d) => sum + d.profileImpressions, 0)}
								keyName="profileImpressions"
							/>
						</Grid.Col>
						<Grid.Col span="content">
							<SingleMetricDisplay
								name="Followers"
								data={data.followers}
								total={data.followers[data.followers.length - 1].followers}
								keyName="followers"
							/>
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
