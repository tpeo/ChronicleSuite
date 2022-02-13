import * as functions from "firebase-functions";

// The Firebase Admin SDK to access Firestore.
import admin = require("firebase-admin");
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { auth } from "firebase-admin";

import "facebook-js-sdk";

admin.initializeApp();
const db = getFirestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
	// Grab the text parameter.
	const original = req.query.text;
	// Push the new message into Firestore using the Firebase Admin SDK.
	const writeResult = await admin.firestore().collection("messages").add({ original: original });
	// Send back a message that we've successfully written the message
	res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// // Listens for new messages added to /messages/:documentId/original and creates an
// // uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore.document("/messages/{documentId}").onCreate((snap, context) => {
// 	functions.logger.log("Running Uppercasing");

// 	// Grab the current value of what was written to Firestore.
// 	const original = snap.data().original;

// 	// Access the parameter `{documentId}` with `context.params`
// 	functions.logger.log("Uppercasing", context.params.documentId, original);

// 	const uppercase = original.toUpperCase();

// 	// You must return a Promise when performing asynchronous tasks inside a Functions such as
// 	// writing to Firestore.
// 	// Setting an 'uppercase' field in Firestore document returns a Promise.
// 	return snap.ref.set({ uppercase }, { merge: true });
// });

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

	const response: AuthResponse = await (await fetch(url.toString())).json();

	const longAccessToken = response.accessToken;

	const writeResult = await admin.firestore().collection("users").add({ metaAuthToken: longAccessToken });

	res.json({ result: `Data with ID: ${writeResult.id} added.` });
});

exports.getPageInsights = functions.firestore.document("/users/{documentId}").onCreate((snap, context) => {
	// Grab the current value of what was written to Firestore.
	const original = snap.data().original;

	// Access the parameter `{documentId}` with `context.params`
	functions.logger.log("Uppercasing", context.params.documentId, original);

	const uppercase = original.toUpperCase();

	// You must return a Promise when performing asynchronous tasks inside a Functions such as
	// writing to Firestore.
	// Setting an 'uppercase' field in Firestore document returns a Promise.
	return snap.ref.set({ uppercase }, { merge: true });
});
