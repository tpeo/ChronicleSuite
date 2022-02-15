import * as functions from "firebase-functions";

// The Firebase Admin SDK to access Firestore.
import admin = require("firebase-admin");
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { auth } from "firebase-admin";

import "@types/facebook-js-sdk";
import { user } from "firebase-functions/v1/auth";

admin.initializeApp();
const db = getFirestore();

// TODO: set response types for fetch functions
// TODO: cache firebase user document id, pageId, etc.

exports.storeMetaAuthToken = functions.https.onRequest(async (req, res) => {
	const shortAccessToken = req.query.token;
	// TODO: Read from firestore db once initialized
	const clientId = "";
	const clientSecret = "";

	const params = new URLSearchParams({
		grant_type: "fb_exchange_token",
		client_id: clientId,
		client_secret: clientSecret,
	});
	const url = new URL("https://graph.facebook.com/oauth/access_token" + params.toString());

	// TODO: fix typescript import
	const response: AuthResponse = await (await fetch(url.toString())).json();
	const longAccessToken = response.accessToken;
	const writeResult = await admin.firestore().collection("users").add({ metaAuthToken: longAccessToken });
	res.json({ result: `Access Token with ID: ${writeResult.id} added.` });
});

exports.getUserInfo = functions.https.onRequest(async (req, res) => {
	// TODO: get user access token from firestore db
	const userAccessToken = "";
	const params = new URLSearchParams({ access_token: userAccessToken });
	const url = new URL("https://graph.facebook.com/me" + params.toString());

	const response = await (await fetch(url.toString())).json();
	// TODO: add info to existing user document
	const writeResult = await admin.firestore().collection("users").add({ userInfo: response });
	res.json({ result: `User Info with ID: ${writeResult.id} added.` });
});

exports.getPageInsights = functions.https.onRequest(async (req, res) => {
	const pageName = req.query.page_name;
	// TODO: get user access token from firestore db
	const userAccessToken = "";

	const params = new URLSearchParams({ access_token: userAccessToken });
	const url = new URL("https://graph.facebook.com/v13.0/{user-id}/accounts" + params.toString());

	const response = await (await fetch(url.toString())).json();

	const pages = response.data;

	let pageId;
	let pageAccessToken;

	for (let i = 0; i < pages.length; i++) {
		const curPage = pages[i];
		if (curPage.name == pageName) pageId = curPage.id;
		pageAccessToken = curPage.access_token;
	}

	// TODO: add info to existing user document
	const writeResult = await admin
		.firestore()
		.collection("users")
		.add({ pageId: pageId, pageAccessToken: pageAccessToken });
	res.json({ result: `Page Insights with ID: ${writeResult.id} added.` });
});

exports.getPagePostInsights = functions.https.onRequest(async (req, res) => {
	// TODO: get values from firestore db
	const pageId = "";
	const pageAccessToken = "";
	const accessToken = "";

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
