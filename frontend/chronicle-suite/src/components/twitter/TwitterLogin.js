import TwitterApi from 'twitter-api-v2';

const scopes = ['tweet.read', 'users.read', 'offline.access'];

const TwitterLogin = () => {
	const client = new TwitterApi({
		clientId: process.env.REACT_APP_TWITTER_CLIENT_ID,
		clientSecret: process.env.REACT_APP_TWITTER_CLIENT_SECRET,
	});
	const { url, codeVerifier, state } = client.generateOAuth2AuthLink(`${process.env.REACT_APP_API_URL}/callback`, {
		scope: scopes,
	});

	const saveURL = new URL(`${process.env.REACT_APP_API_URL}/saveSession`);

	saveURL.search = new URLSearchParams({ codeVerifier: codeVerifier, state: state });

	const response = fetch(saveURL, {
		method: 'POST',
		credentials: 'include',
	});


	return (
		<a href={url}>
			<button>Login with Twitter</button>
		</a>
	);
};;

export default TwitterLogin;
