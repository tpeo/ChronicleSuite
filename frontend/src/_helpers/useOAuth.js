import { useState } from "react";

const OAUTH_STATE_KEY = "react-use-oauth2-state-key";
const POPUP_HEIGHT = 700;
const POPUP_WIDTH = 600;

// https://medium.com/@dazcyril/generating-cryptographic-random-state-in-javascript-in-the-browser-c538b3daae50
const generateState = () => {
	const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let array = new Uint8Array(40);
	window.crypto.getRandomValues(array);
	array = array.map((x) => validChars.codePointAt(x % validChars.length));
	const randomState = String.fromCharCode.apply(null, array);
	return randomState;
};

const openPopup = (url) => {
	// To fix issues with window.screen in multi-monitor setups, the easier option is to
	// center the pop-up over the parent window.
	const top = window.outerHeight / 2 + window.screenY - POPUP_HEIGHT / 2;
	const left = window.outerWidth / 2 + window.screenX - POPUP_WIDTH / 2;
	return window.open(url, "_self", `height=${POPUP_HEIGHT},width=${POPUP_WIDTH},top=${top},left=${left}`);
};

const useOAuth = (props) => {
	const { platform, authorizeUrl, clientId, redirectUri, accessTokenUrl, scope = "", useCodeChallenge } = props;

	const [token, setToken] = useState();

	async function handleOAuth() {
		if (token || !localStorage.getItem(platform)) return cleanup();
		const url = new URL(window.location.href);
		const code = url.searchParams.get("code");
		const error = url.searchParams.get("error");

		console.log(code);

		if (!code && !error) {
			return cleanup();
		} else if (error) {
			console.error(error);
		} else if (code) {
			async function getAccessToken() {
				const response = await fetchAccessToken(code);
				if (!response.ok) return;

				const payload = await response.json();
				if (!payload.accessToken) return console.log(payload);

				return payload.accessToken;
			}
			const response = await getAccessToken();
			if (!response) {
				console.error(`Failed signin with ${platform}`);
			} else {
				console.log(`Successful signin with ${platform}`);
				setToken(response);
			}
		}
		cleanup();
	}

	function getAuthorizationUrl(state) {
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

	async function fetchAccessToken(code) {
		const url = new URL(accessTokenUrl);
		url.searchParams.append("client_id", clientId);
		url.searchParams.append("code", code);
		url.searchParams.append("redirect_uri", redirectUri);
		const response = await fetch(url.toString());
		return response;
	}

	function cleanup() {
		localStorage.removeItem(localStorage.getItem(OAUTH_STATE_KEY));
		localStorage.removeItem(OAUTH_STATE_KEY);
		localStorage.removeItem("token");
		localStorage.removeItem("error");
		localStorage.removeItem(platform);
	}

	function authorize() {
		// Generate and save state
		const state = generateState();
		localStorage.setItem(OAUTH_STATE_KEY, state);
		localStorage.setItem(state, window.location.href);

		localStorage.setItem(platform, "true");

		// Open popup
		openPopup(getAuthorizationUrl(state));
	}

	handleOAuth();

	return { token, authorize };
};

export default useOAuth;
