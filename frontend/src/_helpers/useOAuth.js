import { useRef, useState } from "react";

const OAUTH_STATE_KEY = "react-use-oauth2-state-key";
const POPUP_HEIGHT = 700;
const POPUP_WIDTH = 600;
const OAUTH_RESPONSE = "react-use-oauth2-response";

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
	return window.open(url, "OAuth2 Popup", `height=${POPUP_HEIGHT},width=${POPUP_WIDTH},top=${top},left=${left}`);
};

const closePopup = (popupRef) => {
	popupRef.current?.close();
};

const cleanup = (intervalRef, popupRef, handleMessageListener) => {
	clearInterval(intervalRef.current);
	closePopup(popupRef);
	removeState();
	window.removeEventListener("message", handleMessageListener);
};

function getAuthorizationUrl(authorizeUrl, clientId, redirectUri, scope, state) {
	const url = new URL(authorizeUrl);
	url.searchParams.append("response_type", "code");
	url.searchParams.append("client_id", clientId);
	url.searchParams.append("redirect_uri", redirectUri);
	url.searchParams.append("scope", scope);
	url.searchParams.append("state", state);
	return url.toString();
}

async function fetchAccessToken(serverUrl, clientId, code, redirectUri, platform) {
	const url = new URL(serverUrl);
	url.searchParams.append("client_id", clientId);
	url.searchParams.append("code", code);
	url.searchParams.append("redirect_uri", redirectUri);
	url.searchParams.append("platform", platform);
	const response = await fetch(url.toString());
	return response;
}

const useOAuth = (props) => {
	const { platform, authorizeUrl, clientId, redirectUri, accessTokenUrl, scope = "" } = props;

	const intervalRef = useRef();
	const popupRef = useRef();
	const [{ loading, error }, setUI] = useState({ loading: false, error: null });
	const [token, setToken] = useState();

	const getAuth = () => {
		// 1. Init
		setUI({
			loading: true,
			error: null,
		});

		// 2. Generate and save state
		const state = generateState();
		saveState(state);

		// 3. Open popup
		popupRef.current = openPopup(getAuthorizationUrl(authorizeUrl, clientId, redirectUri, scope, state));

		// 4. Register message listener
		async function handleMessageListener(message) {
			const type = message?.data?.type;
			if (type === OAUTH_RESPONSE) {
				const error = message?.data?.error;
				if (error) {
					setUI({
						loading: false,
						error: error,
					});
				} else {
					const code = message?.data?.payload;
					const response = await fetchAccessToken(accessTokenUrl, clientId, code, redirectUri, platform);

					if (response.ok) {
						const payload = await response.json();
						setUI({
							loading: false,
							error: null,
						});
						// setData(payload);
						setToken(payload.accessToken);
						// Lines above will cause 2 rerenders but it's fine for this tutorial :-)
					} else {
						setUI({
							loading: false,
							error: "Failed to exchange code for token",
						});
					}
				}
			}

			// Clear stuff ...
			cleanup(intervalRef, popupRef, handleMessageListener);
		}
		window.addEventListener("message", handleMessageListener);

		// 4. Begin interval to check if popup was closed forcefully by the user
		intervalRef.current = setInterval(() => {
			const popupClosed = !popupRef.current || !popupRef.current.window || popupRef.current.window.closed;
			if (popupClosed) {
				// Popup was closed before completing auth...
				setUI((ui) => ({
					...ui,
					loading: false,
				}));
				console.warn("Warning: Popup was closed before completing authentication.");
				clearInterval(intervalRef.current);
				removeState();
				window.removeEventListener("message", handleMessageListener);
			}
		}, 250);

		// Remove listener(s) on unmount
		return () => {
			window.removeEventListener("message", handleMessageListener);
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	};

	return [token, getAuth, loading, error];
};

export default useOAuth;
