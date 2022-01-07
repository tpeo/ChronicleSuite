const express = require('express');
const session = require('express-session');
var cors = require('cors');
const TwitterApi = require('twitter-api-v2').default;
require('dotenv').config();
const app = express();
const port = process.env.port;

app.use(
	session({ resave: false, saveUninitialized: true, secret: process.env.EXPRESS_SECRET, cookie: { secure: false } })
);
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// app.get('/callback', (req, res) => {
// 	console.log(req.session);
// 	res.send('Hello World!');
// });

app.post('/saveSession', (req, res) => {
	req.session.state = req.query.state;
	req.session.codeVerifier = req.query.codeVerifier;
	res.send({ error: false });
});

app.get('/callback', (req, res) => {
	// Exact state and code from query string
	const { state, code } = req.query;
	// Get the saved oauth_token_secret from session
	const { codeVerifier, state: sessionState } = req.session;

	if (!codeVerifier || !state || !sessionState || !code) {
		return res.status(400).send('You denied the app or your session expired!');
	}
	if (state !== sessionState) {
		return res.status(400).send('Stored tokens didnt match!');
	}

	// Obtain access token
	const client = new TwitterApi({
		clientId: process.env.TWITTER_CLIENT_ID,
		clientSecret: process.env.TWITTER_CLIENT_SECRET,
	});

	client
		.loginWithOAuth2({ code, codeVerifier, redirectUri: `${process.env.API_URL}/callback` })
		.then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
			// {loggedClient} is an authenticated client in behalf of some user
			// Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
			// If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

			// Example request
			const { data: userObject } = await loggedClient.v2.me();
			console.log(userObject);
			res.send(userObject);
		})
		.catch(() => res.status(403).send('Invalid verifier or access tokens!'));
});

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
