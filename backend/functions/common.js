import cors from "cors";
import functions from "firebase-functions";
import fetch from "node-fetch";

const getPlatformAccessToken = (platform) => {
	const queryData = {
		meta: {
			url: "https://graph.facebook.com/v15.0/oauth/access_token",
			clientId: process.env.META_CLIENT_ID,
			clientSecret: process.env.META_CLIENT_SECRET,
		},
	};
	return functions.https.onRequest(async (req, res) => {
		applyMiddleware(req, res);

		const platformQuery = queryData[platform];

		const authToken = req?.query?.code?.toString();
		const url = new URL(platformQuery.url);
		url.searchParams.append("client_id", platformQuery.clientId);
		url.searchParams.append("redirect_uri", process.env.REDIRECT_URI);
		url.searchParams.append("client_secret", platformQuery.clientSecret);
		url.searchParams.append("code", authToken);

		const response = await safeFetch(url);
		if (response.error) return res.json({ error: response.error });
		// store accessToken
		res.json({ accessToken: response.access_token });
	});
};

const safeFetch = async (url) => {
	const response = await fetch(url.toString());
	if (!response) return { error: "No response" };
	if (!response.ok) return { error: `Error with Status ${response.status}` };
	const data = await response.json();
	return data;
};

const applyMiddleware = (req, res) =>
	cors({ origin: true })(req, res, () => {
		res.set("Access-Control-Allow-Origin", "https://localhost:3000");
	});

export default { getPlatformAccessToken, safeFetch, applyMiddleware };
