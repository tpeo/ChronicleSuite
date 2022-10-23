import functions from "firebase-functions";
import { OAuth2Client } from "google-auth-library";
import common from "./common.js";
import initAdmin from "./init.js";

const { getAccessToken, applyMiddleware, safeFetch } = common;
const { admin } = initAdmin;

const client = new OAuth2Client(process.env.CLIENT_ID);

const verifyAuth = functions.https.onRequest(async (req, res) => {
	applyMiddleware(req, res);

	// const { token } = req.body;
	// if (!token) return res.status(400).json({ error: "Bad Request: Missing Google auth token" });

	// const ticket = await client.verifyIdToken({
	// 	idToken: token,
	// 	audience: process.env.GOOGLE_CLIENT_ID,
	// });
	// const { name, email, picture } = ticket.getPayload();
	// functions.logger.log(ticket.getPayload());
	// const user = await db.user.upsert({
	// 	where: { email: email },
	// 	update: { name, picture },
	// 	create: { name, email, picture },
	// });
	// res.status(200).json({user});
	res.status(200).json({});
});

export default { verifyAuth };
