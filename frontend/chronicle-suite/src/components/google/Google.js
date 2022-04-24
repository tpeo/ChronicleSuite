import GoogleLogin from "react-google-login";
import * as constants from "../../constants.js";

const loginSuccess = async (googleData) => {
	const response = await fetch(`${constants.FIREBASE_EMULATOR_URL}/chroniclesuite/us-central1/default-google-verifyAuth`, {
		method: "POST",
		body: JSON.stringify({
			token: googleData.tokenId,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	console.log(response);
	const data = await response.json();
	// store returned user somehow
};

const loginFailure = () => {
	console.log("Google Login Failed");
};

function Google() {
	return (
		<GoogleLogin
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
			onSuccess={loginSuccess}
			onFailure={loginFailure}
			// cookiePolicy={"single_host_origin"}
		/>
	);
}

export default Google;
