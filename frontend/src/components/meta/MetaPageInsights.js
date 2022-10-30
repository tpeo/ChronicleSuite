import { useEffect, useState } from "react";
import "./../../App.css";
import * as constants from "./../../_helpers/constants";
import { facebookAccountService } from "./../../_services/facebook.account.service";
import fetchUserID from "./../../_services/GetMetaData.js";

function MetaPageInsights() {
	// Collection of published post insights
	// of this Meta Page
	const [publishedPostsInsights, setPublishedPostsInsights] = useState([]);

	useEffect(() => {
		async function fetchPageInsights() {
			await facebookAccountService.getPageInsights(constants.FLEXCEL_PAGE_NAME, setPublishedPostsInsights);
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
