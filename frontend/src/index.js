import { Global, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { errorInterceptor } from "./_helpers/errorInterceptor";
import { jwtInterceptor } from "./_helpers/jwtInterceptor";
import { facebookAccountService } from "./_services/facebook.account.service";

// Require and configure dotenv
// require('dotenv').config()

jwtInterceptor();
errorInterceptor();

// Load facebook sdk, then start React App
facebookAccountService.initFacebookSdk().then(startApp);

function startApp() {
	ReactDOM.render(
		<React.StrictMode>
			<MantineProvider>
				<NotificationsProvider>
					<Global
						styles={() => ({
							"*, *::before, *::after": {
								boxSizing: "border-box",
							},
						})}
					/>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</NotificationsProvider>
			</MantineProvider>
		</React.StrictMode>,
		document.getElementById("root")
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
