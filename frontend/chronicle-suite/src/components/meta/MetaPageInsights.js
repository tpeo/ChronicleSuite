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
			// get user id endpoint
			let params = new URLSearchParams({ token: accessToken });
			let url = constants.FIREBASE_EMULATOR_URL + "/chroniclesuite/us-central1/default-getUserID?" + params.toString();
			let response = await (await fetch(url)).json();
			const userID = response.id;

			// store auth token endpoint
			params = new URLSearchParams({ token: accessToken, userID });
			url = new URL(constants.FIREBASE_EMULATOR_URL + "/chroniclesuite/us-central1/default-storeMetaAuthToken?" + params.toString());
			response = await (await fetch(url)).json();

			// get page access token
			params = new URLSearchParams({ page_name: "Chronicle Suite", userID });
			url = new URL(constants.FIREBASE_EMULATOR_URL + "/chroniclesuite/us-central1/default-getPageAccessToken?" + params.toString());
			response = await (await fetch(url)).json();

			params = new URLSearchParams({ userID });
			url = new URL(constants.FIREBASE_EMULATOR_URL + "/chroniclesuite/us-central1/default-getPagePostInsights?" + params.toString());
			response = await (await fetch(url)).json();

			return response;
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
