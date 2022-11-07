import * as constants from "../_helpers/constants.js";

async function fetchUserID(accessToken) {
	if (!accessToken) return console.error("Not Logged in to Facebook");
	// get user id endpoint
	let params = new URLSearchParams({ token: accessToken });
	let url = constants.FIREBASE_FUNCTIONS_URL + "/chroniclesuite/us-central1/default-meta-getUserID?" + params.toString();
	let response = await (await fetch(url)).json();
	const userID = response.id;

	// get page access token
	params = new URLSearchParams({ page_name: "Chronicle Suite", userID });
	url = new URL(constants.FIREBASE_FUNCTIONS_URL + "/chroniclesuite/us-central1/default-meta-getPageAccessToken?" + params.toString());
	response = await (await fetch(url)).json();

	params = new URLSearchParams({ userID });
	url = new URL(constants.FIREBASE_FUNCTIONS_URL + "/chroniclesuite/us-central1/default-meta-getPagePostInsights?" + params.toString());
	response = await (await fetch(url)).json();

	console.log(response.data);

	return response;
}

export default fetchUserID;
