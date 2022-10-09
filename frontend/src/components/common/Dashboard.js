import { Button, Grid, Select, Stack } from "@mantine/core";
import { useState } from "react";
import * as constants from "../../_helpers/constants.js";
import Chart from "../chart.js";

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
	const [dayRange, setDayRange] = useState("7");

	return (
		<Stack style={{ width: "60%", height: "100%", paddingTop: "30px", paddingBottom: "30px", borderRadius: "20px", boxShadow: "0px 0px 16px gray" }}>
			<Grid align="center">
				<Grid.Col span={1} />
				<Grid.Col span={3}>
					<h2>Impressions</h2>
				</Grid.Col>
				<Grid.Col span={4} />
				<Grid.Col span={3} align="center">
					<Select
						label="Select Date Range"
						onChange={setDayRange}
						defaultValue={dayRange}
						data={[
							{ value: "1", label: "1 Day" },
							{ value: "7", label: "7 Days" },
							{ value: "14", label: "14 Days" },
							{ value: "28", label: "28 Days" },
						]}
					/>
				</Grid.Col>
				<Grid.Col span={1} />
			</Grid>
			<div style={{ height: "300px" }}>
				<Chart dayRange={dayRange} />
			</div>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<Button onClick={() => exportToCSV(constants.data)}>Create Spreadsheet</Button>
			</div>
		</Stack>
	);
}

export default Dashboard;
