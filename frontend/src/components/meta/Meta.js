import { facebookAccountService } from "../../_services/facebook.account.service";
import MetaLogin from "./MetaLogin";
import MetaPageInsights from "./MetaPageInsights";
import { useEffect, useState } from "react";

import * as constants from "../../_helpers/constants";
import { Button } from "@mantine/core";
import { FaFacebookSquare } from "react-icons/fa";
import fetchUserID from "../../_services/GetMetaData";

function Meta() {
	// const [metaAuthStatus, setMetaAuthStatus] = useState(constants.UNAUTHENTICATED);

	// useEffect(() => {
	// 	console.log("Checking Authentication Status");
	// 	async function getFacebookAuthStatus() {
	// 		var authStatus = await facebookAccountService.getFacebookLoginStatus();
	// 		setMetaAuthStatus(authStatus);
	// 		console.log("Authentication Status: " + authStatus);
	// 	}
	// 	getFacebookAuthStatus();
	// 	console.log("Fetched and set authentication status: " + metaAuthStatus);
	// }, []);

	// if (metaAuthStatus) {
	// 	// TODO: add call to firebase endpoint
	// 	// const params = new URLSearchParams({ access_token: authResponse.accessToken });
	// 	// const url = new URL("https://us-central1-chroniclesuite.cloudfunctions.net/getUserID" + params.toString());
	// 	// const response = await (await fetch(url.toString())).json();
	// 	// if (!response) return console.log("no ID Response");

	// 	// console.log(response.id);
	// 	return <MetaPageInsights />;
	// } else {
	// 	return <MetaLogin setMetaAuthStatus={setMetaAuthStatus} />;
	// }
	return (
		<div>
			<Button onClick={facebookAccountService.login} leftIcon={<FaFacebookSquare />} variant="white" size="xl">
				Connect to Facebook
			</Button>
			<Button onClick={() => fetchUserID()}>Get Facebook Data</Button>
		</div>
	);
}

export default Meta;
