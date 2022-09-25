import { Button, Center, Grid } from "@mantine/core";
import Chart from "../chart.js";
import * as constants from "../../_helpers/constants.js";

function exportToCSV(data) {
	let csvContent = "data:text/csv;charset=utf-8,";
	csvContent += Object.keys(data[0]).join(",") + "\n";
	csvContent += data
		.map(Object.values)
		.map((d) => d.join(","))
		.join("\n");

	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "data.csv");
	document.body.appendChild(link); // Required for FF

	link.click(); // This will download the data file named "data.csv".
	link.remove();
}

function Dashboard(props) {
	return (
		<Grid
			grow
			style={{ width: "60%", height: "100%", paddingTop: "30px", paddingBottom: "30px", borderRadius: "20px", boxShadow: "0px 0px 20px" }}
			align="center"
		>
			<Grid.Col span={3} align="center">
				Impressions
			</Grid.Col>
			<Grid.Col span={3} offset={6} align="center">
				Select Date Range
			</Grid.Col>
			<Grid.Col span={12} style={{ height: "600px" }}>
				<Chart />
			</Grid.Col>
			<Grid.Col span={12} align="center">
				<Button onClick={() => exportToCSV(constants.data)}>Create Spreadsheet</Button>
			</Grid.Col>
		</Grid>
	);
}

export default Dashboard;
