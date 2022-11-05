import { useRef, useState } from "react";

const OAUTH_STATE_KEY = "react-use-oauth2-state-key";
const POPUP_HEIGHT = 700;
const POPUP_WIDTH = 600;
const OAUTH_RESPONSE = "react-use-oauth2-response";
const ERROR_CODE = "ERROR";
const SUCCESS_CODE = "SUCCESS";

// https://medium.com/@dazcyril/generating-cryptographic-random-state-in-javascript-in-the-browser-c538b3daae50
const generateState = () => {
	const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let array = new Uint8Array(40);
	window.crypto.getRandomValues(array);
	array = array.map((x) => validChars.codePointAt(x % validChars.length));
	const randomState = String.fromCharCode.apply(null, array);
	return randomState;
};

const saveState = (state) => {
	sessionStorage.setItem(OAUTH_STATE_KEY, state);
};

const removeState = () => {
	sessionStorage.removeItem(OAUTH_STATE_KEY);
};

const openPopup = (url) => {
	// To fix issues with window.screen in multi-monitor setups, the easier option is to
	// center the pop-up over the parent window.
	const top = window.outerHeight / 2 + window.screenY - POPUP_HEIGHT / 2;
	const left = window.outerWidth / 2 + window.screenX - POPUP_WIDTH / 2;
	return window.open(url, "_blank", `height=${POPUP_HEIGHT},width=${POPUP_WIDTH},top=${top},left=${left}`);
};

const closePopup = (popupRef) => {
	popupRef.current?.close();
};

async function fetchAccessToken(serverUrl, clientId, code, redirectUri) {
	const url = new URL(serverUrl);
	url.searchParams.append("client_id", clientId);
	url.searchParams.append("code", code);
	url.searchParams.append("redirect_uri", redirectUri);
	const response = await fetch(url.toString());
	return response;
}

const useOAuth = (props) => {
	const { platform, authorizeUrl, clientId, redirectUri, accessTokenUrl, scope = "", useCodeChallenge } = props;

	const intervalRef = useRef();
	const popupRef = useRef();
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState();

	function getAuthorizationUrl(authorizeUrl, state) {
		const url = new URL(authorizeUrl);
		url.searchParams.append("response_type", "code");
		url.searchParams.append("client_id", clientId);
		url.searchParams.append("redirect_uri", redirectUri);
		if (scope) url.searchParams.append("scope", scope);
		url.searchParams.append("state", state);
		if (useCodeChallenge) {
			url.searchParams.append("code_challenge", "challenge");
			url.searchParams.append("code_challenge_method", "plain");
		}
		return url.toString();
	}

	const cleanup = (handleMessageListener) => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		closePopup(popupRef);
		removeState();
		setLoading(false);
		window.removeEventListener("message", handleMessageListener);
	};

	const authorize = () => {
		setLoading(true);

		// Generate and save state
		const state = generateState();
		saveState(state);

		// Open popup
		popupRef.current = openPopup(getAuthorizationUrl(authorizeUrl, state));

		// Register message listener
		async function handleMessageListener(message) {
			const handleMessage = async () => {
				const type = message?.data?.type;
				const error = message?.data?.error;
				if (type !== OAUTH_RESPONSE || error) return error;

				const code = message?.data?.payload;
				if (!code) return ERROR_CODE;

				const response = await fetchAccessToken(accessTokenUrl, clientId, code, redirectUri);
				if (!response.ok) return ERROR_CODE;

				const payload = await response.json();
				if (!payload.accessToken) return ERROR_CODE;

				setToken(payload.accessToken);
				return SUCCESS_CODE;
			};
			const response = await handleMessage();
			if (response === SUCCESS_CODE) console.log(`Successful signin with ${platform}`);
			else if (response === ERROR_CODE) console.error(`Failed signin with ${platform}`);
			else console.error(response);

			// Clear stuff ...
			cleanup(handleMessageListener);
		}
		window.addEventListener("message", handleMessageListener);

		// Begin interval to check if popup was closed forcefully by the user
		intervalRef.current = setInterval(() => {
			const popupClosed = !popupRef?.current?.window || popupRef.current.window.closed;
			if (popupClosed) {
				// Popup was closed before completing auth
				console.warn("Popup was closed before completing authentication");
				cleanup(handleMessageListener);
			}
		}, 250);

		// Remove listener on unmount
		return cleanup;
	};

	return { token, authorize, loading };
};

export default useOAuth;
