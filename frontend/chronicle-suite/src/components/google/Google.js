import GoogleLogin from "react-google-login";

const handleLogin = async (googleData) => {
	const res = await fetch("/api/v1/auth/google", {
		method: "POST",
		body: JSON.stringify({
			token: googleData.tokenId,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await res.json();
	// store returned user somehow
};

function Google() {
	return (
		<GoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			onSuccess={handleLogin}
			onFailure={handleLogin}
			// cookiePolicy={"single_host_origin"}
		/>
	);
}

export default Google;
