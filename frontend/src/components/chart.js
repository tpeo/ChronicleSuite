import React, { PureComponent } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as constants from "../_helpers/constants.js";

export default class Example extends PureComponent {
	static demoUrl = "https://codesandbox.io/s/simple-bar-chart-tpz8r";

	render() {
		return (
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={constants.data} margin={{ top: 20, bottom: 20, left: 30, right: 40 }}>
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
}
