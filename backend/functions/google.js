import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.CLIENT_ID);

const verifyAuth = functions.https.onRequest(async (req, res) => {
	const { token } = req.body;
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID,
	});
	const { name, email, picture } = ticket.getPayload();
	// const user = await db.user.upsert({
	// 	where: { email: email },
	// 	update: { name, picture },
	// 	create: { name, email, picture },
	// });
	res.status(200);
	res.json(user);
});
