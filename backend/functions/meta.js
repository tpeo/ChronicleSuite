const cors = require("cors")({ origin: true });
const { FieldValue } = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const fetch = require("node-fetch");
const { admin } = require("./init.js");

const applyMiddleware = (req, res) => {
	cors(req, res, () => {
		res.set("Access-Control-Allow-Origin", "https://localhost:3000");
	});
};

// TODO: Test generation of long term access token
// Get ltat, call /me endpoint to get user name, send to ChronicleSuite
exports.getUserID = functions.https.onRequest(async (req, res) => {
	applyMiddleware(req, res);

	const accessToken = req?.query?.token?.toString();
	if (!accessToken) {
		res.json({ result: "Access Token undefined" });
		return;
	}
	const params = new URLSearchParams({ access_token: accessToken });
	const url = new URL("https://graph.facebook.com/me?" + params.toString());

	// ? User has type any
	const response = await (await fetch(url.toString())).json();
	functions.logger.log(response);
	const userID = response.id;
	const writeResult = await admin.firestore().collection("users").doc(userID).set({ userID });

	res.json({ id: response.id, result: `User ID ${userID} written` });
});

// Gets long term access token for Meta Authentiation
// = require( ChronicleSuite frontend and stores it i)n
// Firebase DB
// https://developers.facebook.com/docs/pages/access-tokens/
exports.storeMetaAuthToken = functions.https.onRequest(async (req, res) => {
	applyMiddleware(req, res);

	// Check if Meta Auth Token (long term access token)
	// is stored in Firebase DB
	// getUserInfo for user id
	const userID = req.query.userID;

	// Get short term acces token = require( re)q
	const metaAuthShortTermAccessToken = req?.query?.token?.toString();

	if (!metaAuthShortTermAccessToken) {
		res.json({ result: "Short Term Access Token undefined" });
		return;
	}

	// Get long term access token
	const params = new URLSearchParams({
		grant_type: "fb_exchange_token",
		client_id: process.env.META_CLIENT_ID,
		client_secret: process.env.META_CLIENT_SECRET,
		fb_exchange_token: metaAuthShortTermAccessToken,
	});
	const url = new URL("https://graph.facebook.com/oauth/access_token?" + params.toString());

	const response = await (await fetch(url.toString())).json();
	if (response.error) res.json({ error: true });
	functions.logger.log(response);

	const longTermAccessToken = response.access_token;

	// Store long term access token in Firebase DB
	await admin.firestore().collection("users").doc(userID).update({ metaAuthToken: longTermAccessToken });

	res.json({ result: `Access Token ${longTermAccessToken} added.` });
});

exports.getUserInfo = functions.https.onRequest(async (req, res) => {
	applyMiddleware(req, res);

	const userID = req.query.userID;
	const userAccessToken = await (await admin.firestore().collection("users").doc(userID).get()).data()?.metaAuthToken;
	const params = new URLSearchParams({ access_token: userAccessToken });
	const url = new URL("https://graph.facebook.com/me?" + params.toString());

	// ? User has type any
	const response = await (await fetch(url.toString())).json();
	const writeResult = await admin.firestore().collection("users").doc(userID).update({ userInfo: response });
	res.json({ result: `User Info with ID: ${writeResult} added.` });
});

exports.getPageAccessToken = functions.https.onRequest(async (req, res) => {
	applyMiddleware(req, res);

	const pageName = req.query.page_name;
	const userID = req.query.userID;
	const user = await (await admin.firestore().collection("users").doc(userID).get()).data();
	if (!user) {
		res.json({ result: `User with ID ${userID} doesn't exist` });
		return;
	}

	const userAccessToken = user.metaAuthToken;

	const params = new URLSearchParams({ access_token: userAccessToken });
	const url = new URL(`https://graph.facebook.com/v13.0/${userID}/accounts?` + params.toString());

	const response = await (await fetch(url.toString())).json();

	const pages = response.data;
	if (!pages) return res.json({ error: "No pages found under this account" });

	const page = pages.find((page) => page.name == pageName);
	if (!page) return res.json({ error: `No page found with name ${pageName}` });
	const { id: pageId, access_token: pageAccessToken } = page;

	const writeResult = await admin.firestore().collection("users").doc(userID).update({ pageId: pageId, pageAccessToken: pageAccessToken });
	res.json({ result: `Page Insights with ID: ${writeResult} added.` });
});

exports.getPagePostInsights = functions.https.onRequest(async (req, res) => {
	applyMiddleware(req, res);

	const userID = req.query.userID;

	const user = await (await admin.firestore().collection("users").doc(userID).get()).data();
	if (!user) {
		res.json({ result: `User with ID ${userID} doesn't exist` });
		return;
	}

	const pageId = user.pageId;
	const pageAccessToken = user.pageAccessToken;
	const accessToken = user.metaAuthToken;

	const params = new URLSearchParams({ access_token: pageAccessToken });
	let url = new URL(`https://graph.facebook.com/v13.0/${pageId}/published_posts?` + params.toString());

	let response = await (await fetch(url.toString())).json();

	const pagePosts = response.data;

	pagePosts.forEach(async (post) => {
		const { message: caption, created_time, id: postID } = post;

		const batch = [
			{
				// Get post url and icon
				method: "GET",
				relative_url: `${postID}/?` + new URLSearchParams({ fields: "permalink_url,full_picture", access_token: pageAccessToken }).toString(),
			},
			{
				// Get post likes count
				method: "GET",
				relative_url:
					`${postID}/insights?` +
					new URLSearchParams({
						metric: "post_reactions_like_total",
						access_token: pageAccessToken,
					}).toString(),
			},
			// Get post comments count
			{
				method: "GET",
				relative_url: `${postID}/comments?` + new URLSearchParams({ summary: "1", access_token: pageAccessToken }).toString(),
			},
		];

		const p = new URLSearchParams({ access_token: accessToken, include_headers: "false", batch: JSON.stringify(batch) });
		url = new URL(`https://graph.facebook.com/v13.0/${postID}?` + p.toString());

		response = await (
			await fetch(url.toString(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})
		).json();

		const [postMetaData, reactions, comments] = response;
		const permalink_url = JSON.parse(postMetaData.body).permalink_url;
		const reactionData = JSON.parse(reactions.body).data;
		const filteredReactions = {};
		reactionData.forEach((element) => {
			const { name, values } = element;
			const totalReactions = values.reduce((s, value) => s + Object.values(value).reduce((r, i) => r + parseInt(i), 0), 0);
			filteredReactions[name] = totalReactions;
		});

		const commentData = JSON.parse(comments.body).data;
		const parsedComments = commentData.map((comment) => comment.message);

		const postData = { caption, created_time, permalink_url, reactions: filteredReactions, comments: parsedComments, platform: "Meta" };
		await admin.firestore().collection("posts").doc(postID).set(postData);
		await admin
			.firestore()
			.collection("users")
			.doc(userID)
			.update({ posts: FieldValue.arrayUnion(postID) });
	});
	res.json({ result: `Successfully wrote page posts to firestore db` });
});
