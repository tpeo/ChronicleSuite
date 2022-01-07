const express = require('express');
const app = express();
const port = 3000;

app.get('/callback', (req, res) => {
	res.send('Hello World!');
});

// app.get('/callback', (req, res) => {
// 	// Exact state and code from query string
// 	const { state, code } = req.query;
// 	// Get the saved oauth_token_secret from session
// 	const { codeVerifier, state: sessionState } = req.session;

// 	if (!codeVerifier || !state || !sessionState || !code) {
// 		return res.status(400).send('You denied the app or your session expired!');
// 	}
// 	if (state !== sessionState) {
// 		return res.status(400).send('Stored tokens didnt match!');
// 	}

// 	// Obtain access token
// 	const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

// 	client
// 		.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
// 		.then(({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
// 			// {loggedClient} is an authenticated client in behalf of some user
// 			// Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
// 			// If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

// 			// Example request
// 			const { data: userObject } = await loggedClient.v2.me();
// 		})
// 		.catch(() => res.status(403).send('Invalid verifier or access tokens!'));
// });

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
