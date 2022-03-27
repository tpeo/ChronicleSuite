import { useEffect, useState } from "react";
import "./../../App.css";
import { facebookAccountService } from "./../../_services/facebook.account.service";
import * as constants from "./../../constants";

function MetaPageInsights() {
	// Collection of published post insights
	// of this Meta Page
	const [publishedPostsInsights, setPublishedPostsInsights] = useState([]);

	useEffect(() => {
		async function fetchPageInsights() {
			await facebookAccountService.getPageInsights(constants.FLEXCEL_PAGE_NAME, setPublishedPostsInsights);
		}
		async function fetchUserID() {
			let accessToken = window.FB.getAccessToken();
			const params = new URLSearchParams({ token: accessToken });
			const url = "http://localhost:5000/chroniclesuite/us-central1/default-getUserID?" + params.toString();
			const response = await fetch(url);
			return response;
			// console.log(response);
		}
		// fetchPageInsights();
		fetchUserID().then((response) => {
			response.json().then((response) => console.log(response));
		});
	});

	return (
		<div className="col-md-6 offset-md-3 mt-5 text-center">
			<h1>Flexcel Page Insights</h1>
			<h1>Flexcel Page Post Insights</h1>
		</div>
	);
}

export default MetaPageInsights;
