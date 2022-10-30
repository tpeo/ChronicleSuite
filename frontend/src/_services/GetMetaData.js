import * as constants from "../_helpers/constants.js";

async function fetchUserID() {
	const accessToken = window.FB.getAccessToken();
	if (!accessToken) return console.error("Not Logged in to Facebook");
	// get user id endpoint
	let params = new URLSearchParams({ token: accessToken });
	let url = constants.FIREBASE_FUNCTIONS_URL + "/chroniclesuite/us-central1/meta-getUserID?" + params.toString();
	let response = await (await fetch(url)).json();
	const userID = response.id;

	// store auth token endpoint
	params = new URLSearchParams({ token: accessToken, userID });
	url = new URL(constants.FIREBASE_FUNCTIONS_URL + "/chroniclesuite/us-central1/meta-storeMetaAuthToken?" + params.toString());
	response = await (await fetch(url)).json();

	// get page access token
	params = new URLSearchParams({ page_name: "Chronicle Suite", userID });
	url = new URL(constants.FIREBASE_FUNCTIONS_URL + "/chroniclesuite/us-central1/meta-getPageAccessToken?" + params.toString());
	response = await (await fetch(url)).json();

	params = new URLSearchParams({ userID });
	url = new URL(constants.FIREBASE_FUNCTIONS_URL + "/chroniclesuite/us-central1/meta-getPagePostInsights?" + params.toString());
	response = await (await fetch(url)).json();

	return response;
}
// fetchPageInsights();
// fetchUserID().then((response) => {
// 	response.json().then((response) => console.log(response));
// });

export default fetchUserID;
