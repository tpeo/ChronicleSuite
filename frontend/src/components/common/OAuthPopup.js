// OAuth2Popup.jsx
import { useEffect } from "react";

const OAUTH_STATE_KEY = "react-use-oauth2-state-key";

const checkState = (receivedState) => {
	const state = localStorage.getItem(OAUTH_STATE_KEY);
	return state === receivedState;
};

const OAuthPopup = (props) => {
	const {
		Component = (
			<div style={{ margin: "12px" }} data-testid="popup-loading">
				Loading...
			</div>
		),
	} = props;

	// On mount
	useEffect(() => {
		const url = new URL(window.location.href);
		const payload = url.searchParams;
		const state = payload.get("state");
		const error = checkState(state) ? payload.get("error") : "State Mismatch";
		const code = payload.get("code");

		console.log(code);

		const redirectUrl = new URL(localStorage.getItem(state));
		if (code) redirectUrl.searchParams.append("code", code);
		if (error) redirectUrl.searchParams.append("error", error);
		window.open(redirectUrl, "_self");
	}, []);

	return Component;
};

export default OAuthPopup;
