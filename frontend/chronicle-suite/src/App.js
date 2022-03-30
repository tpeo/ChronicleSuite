import "./App.css";
import { facebookAccountService } from "./_services/facebook.account.service";
import MetaLogin from "./components/meta/MetaLogin";
import MetaPageInsights from "./components/meta/MetaPageInsights";
import { useEffect, useState } from "react";

import * as constants from "./constants";

function App() {
	const [metaAuthStatus, setMetaAuthStatus] = useState(constants.UNAUTHENTICATED);

	useEffect(() => {
		console.log("Checking Authentication Status");
		async function getFacebookAuthStatus() {
			var authStatus = await facebookAccountService.getFacebookLoginStatus();
			setMetaAuthStatus(authStatus);
			console.log("Authentication Status: " + authStatus);
		}
		getFacebookAuthStatus();
		console.log("Fetched and set authentication status: " + metaAuthStatus);
	}, []);

	if (metaAuthStatus) {
		// TODO: add call to firebase endpoint
		// const params = new URLSearchParams({ access_token: authResponse.accessToken });
		// const url = new URL("https://us-central1-chroniclesuite.cloudfunctions.net/getUserID" + params.toString());
		// const response = await (await fetch(url.toString())).json();
		// if (!response) return console.log("no ID Response");

		// console.log(response.id);
		return <MetaPageInsights />;
	} else {
		return <MetaLogin setMetaAuthStatus={setMetaAuthStatus} />;
	}
}

export default App;
