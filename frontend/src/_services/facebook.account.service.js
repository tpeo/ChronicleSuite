// import { auth } from "firebase-admin";
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
import * as constants from "./../_helpers/constants";
import { utils } from "./../_helpers/utils";

// const auth = firebase.auth();

const facebookAppId = process.env.REACT_APP_META_CLIENT_ID;

export const facebookAccountService = {
	login,
	initFacebookSdk,
	getFacebookLoginStatus,
	getPageInsights,
};

// Loads the Facebook SDK into the
// browser
async function initFacebookSdk() {
	return new Promise((resolve) => {
		window.fbAsyncInit = function () {
			window.FB.init({
				appId: facebookAppId,
				cookie: true,
				xfbml: true,
				version: "v13.0",
			});
		};
		// load facebook sdk script
		(function (d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		})(document, "script", "facebook-jssdk");
		console.log("Integrated Facebook SDK!");
		resolve();
	});
}

// Retrieves the login status of the
// current user
async function getFacebookLoginStatus() {
	// Waiting for SDK to load
	// Terrible code, should write signal
	// to frontend that SDK has been loaded
	await delay(constants.ONE_SEC);
	var status = constants.UNAUTHENTICATED;
	window.FB.getLoginStatus((response) => {
		if (response.authResponse) {
			window.FB.api("/me", constants.GET_REQUEST, { fields: "id,name,email" }, function (response) {
				console.log("Good to see you, " + response.name);
			});
			status = constants.AUTHENTICATED;
		}
	});
	return status;
}

// Login with facebook then authenticate with
// the API to get a JWT auth token
async function login(setMetaAuthStatus) {
	const { authResponse } = await new Promise(() => window.FB.login(() => {}, { scope: constants.LOGIN_PERMISSION_SCOPE }));
	// setMetaAuthStatus(!!authResponse);
}

// Get page insights of the given
// page name
async function getPageInsights(pageName, setPublishedPostsInsightsSignal) {
	// Get page accounts of user
	var accountsEndpoint = `/${window.FB.getAuthResponse().userID}${constants.USER_ACCOUNTS_ENDPOINT_PATH}`;
	console.log(accountsEndpoint);
	// Get page accounts of this user
	window.FB.api(accountsEndpoint, function (response) {
		console.log(response);
		if (response && !response.error) {
			// Get Page ID and Page Access Token
			// of the requested pageName of Page Insights
			var pageIdAndAccessToken = utils.getPageIdAndAccessToken(response.data, pageName);
			var pageId = pageIdAndAccessToken[constants.PAGE_ID_INDEX];
			var pageAccessToken = pageIdAndAccessToken[constants.PAGE_ACCESS_TOKEN_INDEX];
			console.log("Flexcel Page ID: " + pageId);
			console.log(pageName + " Posts");
			var publishedPostsEndpoint = `/${pageId}${constants.PUBLISHED_POSTS_ENDPOINT_PATH}`;

			// Get Page Insights of this page

			// Get published posts insights of this page
			window.FB.api(publishedPostsEndpoint, { access_token: pageAccessToken }, function (response) {
				if (response && !response.error) {
					getPagePostsInsights(pageAccessToken, response.data, setPublishedPostsInsightsSignal);
					console.log(response);
				}
			});
		}
	});
}

// Gets the page posts insights and sends
// the data to the frontend
async function getPagePostsInsights(pageAccessToken, pagePostsNodes, setPublishedPostsInsightsSignal) {
	for (var i = 0; i < pagePostsNodes.length; i++) {
		var postId = pagePostsNodes[i].id;
		// Get Post Metadata (Refer to Tech Spec)

		// Get meta data of post
		// Need to reformat date to be
		// user readable
		var postCreatedTime = pagePostsNodes[i].created_time;
		// Extract date and time from postCreatedTime
		var caption = pagePostsNodes[i].message;
		var platform = constants.FACEBOOK_PLATFORM;

		// Make a batch request to get post meta data
		// and post insights from PagePost node
		// This is a very expensive call :(
		window.FB.api(
			`/${postId}/`,
			constants.POST_REQUEST,
			{
				batch: [
					{
						// Get post url and icon
						method: constants.GET_REQUEST,
						relative_url: `${postId}/?fields=permalink_url,full_picture`,
					},
					{
						// Get post likes count
						method: constants.GET_REQUEST,
						relative_url: `${postId}/${constants.PAGE_POST_LIKES_TOTAL_ENDPOINT_PATH}${pageAccessToken}`,
					},
					// Get post comments count
					{
						method: constants.GET_REQUEST,
						relative_url: `${postId}/comments/?summary=1&access_token=${pageAccessToken}`,
					},
					// Get post impressions
					// Get post engagement
					// Get attached link clicks count
				],
				include_headers: false,
			},
			function (response) {
				console.log(response);
			}
		);

		// Get insights of post (number of likes, comments)

		console.log(postId + " " + postCreatedTime + " " + caption);
	}
}

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
