// OAuth2Popup.jsx
import { useEffect } from "react";

const OAUTH_STATE_KEY = "react-use-oauth2-state-key";
const OAUTH_RESPONSE = "react-use-oauth2-response";

const checkState = (receivedState) => {
	const state = sessionStorage.getItem(OAUTH_STATE_KEY);
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
		const error = payload.get("error");

		if (!window.opener) {
			throw new Error("No window opener found");
		}

		if (error) {
			window.opener.postMessage({
				type: OAUTH_RESPONSE,
				error: decodeURI(error) || "OAuth error: An error has occured.",
			});
		} else if (!state || !checkState(state)) {
			window.opener.postMessage({
				type: OAUTH_RESPONSE,
				error: "OAuth error: State mismatch.",
			});
		} else {
			window.opener.postMessage({
				type: OAUTH_RESPONSE,
				payload: payload.get("code"),
			});
		}
	}, []);

	return Component;
};

export default OAuthPopup;
