import functions from "firebase-functions";
import common from "./common.js";
import initAdmin from "./init.js";

const { applyMiddleware, safeFetch } = common;
const { admin } = initAdmin;

const getAccessToken = functions.https.onRequest(async (req, res) => {
	applyMiddleware(req, res);

	const authToken = req?.query?.code?.toString();

	// get short term token
	let url = new URL("https://api.twitter.com/2/oauth2/token");
	const body = new FormData();
	body.append("client_id", process.env.INSTAGRAM_CLIENT_ID);
	body.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET);
	body.append("code", authToken);
	body.append("grant_type", "authorization_code");
	body.append("redirect_uri", process.env.REDIRECT_URI);

	let response = await safeFetch(url, { method: "POST", body });
	if (response.error) return res.json(response);

	// const accessToken = response.access_token;

	// // exchange short term token for long term token
	// url = new URL("https://graph.instagram.com/access_token");
	// url.searchParams.append("client_id", process.env.INSTAGRAM_CLIENT_ID);
	// url.searchParams.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET);
	// url.searchParams.append("redirect_uri", process.env.REDIRECT_URI);
	// url.searchParams.append("grant_type", "ig_exchange_token");
	// url.searchParams.append("access_token", accessToken);

	// response = await safeFetch(url);
	// if (response.error) return res.json({ error: response.error });

	// store accessToken
	res.json({ accessToken: response.access_token });
});

export default { getAccessToken };
