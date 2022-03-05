/* eslint-disable camelcase */
import * as functions from "firebase-functions";

// The Firebase Admin SDK to access Firestore.
import admin = require("firebase-admin");
// import { getFirestore } from "firebase-admin/firestore";

// import "@types/facebook-js-sdk";

admin.initializeApp();
// const db = getFirestore();

// TODO: Test generation of long term access token
// Get ltat, call /me endpoint to get user name, send to ChronicleSutie

// TODO: Store long term access token in Firebase DB

exports.getUserID = functions.https.onRequest(async (req, res) => {
	const accessToken: string | undefined = req?.query?.token?.toString();
	if (!accessToken) {
		res.json({ result: "Access Token undefined" });
		return;
	}
	const params = new URLSearchParams({ access_token: accessToken });
	const url = new URL("https://graph.facebook.com/me" + params.toString());

	// ? User has type any
	const response: facebook.User = await (await fetch(url.toString())).json();
	res.json({ id: response.id });
});

// Gets long term access token for Meta Authentiation
// from ChronicleSuite frontend and stores it in
// Firebase DB
// https://developers.facebook.com/docs/pages/access-tokens/
exports.storeMetaAuthToken = functions.https.onRequest(async (req, res) => {
	// Check if Meta Auth Token (long term access token)
	// is stored in Firebase DB

	// Get short term acces token from req
	const metaAuthShortTermAccessToken: string | undefined = req?.query?.token?.toString();

	if (!metaAuthShortTermAccessToken) {
		res.json({ result: "Short Term Access Token undefined" });
		return;
	}

	// Get long term access token
	const params = new URLSearchParams({
		grant_type: "fb_exchange_token",
		client_id: "1017960119077876",
		client_secret: "cffd590264e00c3a6461eb18db460852",
		fb_exchange_token: metaAuthShortTermAccessToken,
	});
	const url = new URL("https://graph.facebook.com/oauth/access_token" + params.toString());

	// TODO: fix typescript import
	const response: facebook.AuthResponse = await (await fetch(url.toString())).json();
	const longTermAccessToken = response.accessToken;

	// getUserInfo for user id
	const userID = "";

	// Store long term access token in Firebase DB
	await admin.firestore().collection("users").doc(userID).create({ metaAuthToken: longTermAccessToken });

	res.json({ result: `Access Token ${longTermAccessToken} added.` });
});

exports.getUserInfo = functions.https.onRequest(async (req, res) => {
	// TODO: get userID from cache/frontend?
	const userID = "";
	const userAccessToken = await (await admin.firestore().collection("users").doc(userID).get()).data()?.metaAuthToken;
	const params = new URLSearchParams({ access_token: userAccessToken });
	const url = new URL("https://graph.facebook.com/me" + params.toString());

	// ? User has type any
	const response: facebook.User = await (await fetch(url.toString())).json();
	const writeResult = await admin.firestore().collection("users").doc(userID).set({ userInfo: response });
	res.json({ result: `User Info with ID: ${writeResult} added.` });
});

interface Page {
	id: string;
	name: string;
	access_token: string;
}

exports.getPageInsights = functions.https.onRequest(async (req, res) => {
	const pageName = req.query.page_name;
	// TODO: get userID from cache/frontend?
	const userID = "";
	const userAccessToken = await (await admin.firestore().collection("users").doc(userID).get()).data()?.metaAuthToken;

	const params = new URLSearchParams({ access_token: userAccessToken });
	const url = new URL("https://graph.facebook.com/v13.0/{user-id}/accounts" + params.toString());

	const response = await (await fetch(url.toString())).json();

	const pages = response.data;

	const { id: pageId, access_token: pageAccessToken } = pages.find((page: Page) => page.name == pageName);

	const writeResult = await admin
		.firestore()
		.collection("users")
		.doc(userID)
		.set({ pageId: pageId, pageAccessToken: pageAccessToken });
	res.json({ result: `Page Insights with ID: ${writeResult} added.` });
});

exports.getPagePostInsights = functions.https.onRequest(async (req, res) => {
	// TODO: get userID from cache/frontend?
	const userID = "";
	const user = await (await admin.firestore().collection("users").doc(userID).get()).data();
	if (!user) {
		res.json({ result: `User with ID ${userID} doesn't exist` });
		return;
	}

	const pageId = user.pageId;
	// const pageAccessToken = user.pageAccessToken;
	const accessToken = user.metaAuthToken;

	let params = new URLSearchParams({ access_token: accessToken });
	// ? Might have to change v13.0 to v12.0
	let url = new URL(`https://graph.facebook.com/v13.0/${pageId}/published_posts` + params.toString());

	let response = await (await fetch(url.toString())).json();

	const pagePosts = response.data;

	for (let i = 0; i < pagePosts.length; i++) {
		const postId = pagePosts[i].id;

		const batch = [
			{
				// Get post url and icon
				method: "GET",
				relative_url: new URLSearchParams(
					{ fields: "permalink_url,full_picture", access_token: accessToken }.toString()
				),
			},
			{
				// Get post likes count
				method: "GET",
				relative_url:
					"/insights" +
					new URLSearchParams({
						metric: "post_reactions_by_type_total",
						access_token: accessToken,
					}).toString(),
			},
			// Get post comments count
			{
				method: "GET",
				relative_url: "/comments" + new URLSearchParams({ summary: "1", access_token: accessToken }).toString(),
			},
		];

		params = new URLSearchParams({ batch: batch.toString() });
		url = new URL(`"https://graph.facebook.com/v13.0/${postId}` + params.toString());

		response = await (await fetch(url.toString())).json();

		// TODO: write response insights to db and return in res.json
	}
});
