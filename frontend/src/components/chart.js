import { DateTime, Duration } from "luxon";
import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Chart(props) {
	function spliceData() {
		const data = props.data;
		if (!props.dayRange) return data;
		const dayRange = Duration.fromObject({ days: props.dayRange });
		// const today = DateTime.now().startOf("day");
		const today = DateTime.fromFormat("11/04", "MM/dd");
		const startDay = today.minus(dayRange);
		const startIndex = data.findIndex((e) => {
			const date = DateTime.fromFormat(e.date, "MM/dd");
			return date >= startDay;
		});
		return data.slice(startIndex);
	}

	return (
		<ResponsiveContainer width="100%" height="100%">
			{props.compact ? (
				<LineChart data={props.data}>
					<XAxis tick={false} dataKey="date" />
					<Tooltip contentStyle={{ fontSize: "10px" }} allowEscapeViewBox={{ x: true, y: true }} />
					<Line type="monotone" dot={false} dataKey={props.keyName} stroke="#8884d8" />
				</LineChart>
			) : (
				<BarChart data={spliceData()} maxBarSize={80}>
					<CartesianGrid />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Bar dataKey={props.keyName} fill="#82ca9d" />
				</BarChart>
			)}
		</ResponsiveContainer>
	);
}
