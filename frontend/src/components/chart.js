import React, { PureComponent } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DateTime, Duration } from "luxon";
import * as constants from "../_helpers/constants.js";

export default function Chart(props) {
	function spliceData() {
		const data = constants.data;
		const dayRange = Duration.fromObject({ days: props.dayRange });
		// const today = DateTime.now().startOf("day");
		const today = DateTime.fromFormat("11/04", "MM/dd");
		const startDay = today.minus(dayRange);
		const startIndex = data.findIndex((e) => {
			const date = DateTime.fromFormat(e.name, "MM/dd");
			return date >= startDay;
		});
		return data.slice(startIndex);
	}

	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart data={spliceData()} margin={{ top: 20, bottom: 20, left: 30, right: 40 }}>
				<CartesianGrid />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="impressions" fill="#82ca9d" />
			</BarChart>
		</ResponsiveContainer>
	);
}
