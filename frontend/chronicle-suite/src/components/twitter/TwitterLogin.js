import TwitterApi from 'twitter-api-v2';

const scopes = ['tweet.read', 'users.read', 'offline.access'];

const TwitterLogin = () => {
	const client = new TwitterApi({
		clientId: process.env.REACT_APP_TWITTER_CLIENT_ID,
		clientSecret: process.env.REACT_APP_TWITTER_CLIENT_SECRET,
	});
	const { url, codeVerifier, state } = client.generateOAuth2AuthLink(process.env.REACT_APP_TWITTER_REDIRECT_URI, {
		scope: scopes,
	});

	return <button href={url}>Login with Twitter</button>;
};

export default TwitterLogin;
