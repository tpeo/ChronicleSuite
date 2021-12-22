import env from '../env'

import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

import { browserHistory } from '../_helpers/browserHistory'

const facebookAppId = env.REACT_APP_FACEBOOK_APP_ID;

const baseUrl = `${env.REACT_APP_API_URL}/accounts`;
const accountSubject = new BehaviorSubject(null);

export const facebookAccountService = {
    login,
    initFacebookSdk,
    // apiAuthenticate,
};

function initFacebookSdk() {
    return new Promise(resolve => {
        // wait for facebook sdk to initialize before starting the react app
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v12.0'
            });

            // auto authenticate with the api if already logged in with facebook
            window.FB.getLoginStatus(({ authResponse }) => {
                if (authResponse.accessToken) {
                    // User has already logged in...
                    window.FB.api('/me', function(response) {
                        console.log('Good to see you, ' + response.name + '.');
                        const userID = response.id
                    });
                    // Retrieve Page, Page Posts from 
                    // User Access token
                } else {
                    resolve();
                }
            });
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));    
    });
}

async function login() {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(window.FB.login);
    if (!authResponse) return;

    // await apiAuthenticate(authResponse.accessToken);

    // get return url from location state or default to home page
    // const { from } = browserHistory.location.state || { from: { pathname: "/" } };
    // browserHistory.push(from);
}

// async function apiAuthenticate(accessToken) {
//     // authenticate with the api using a facebook access token,
//     // on success the api returns an account object with a JWT auth token
//     const response = await axios.post(`${baseUrl}/authenticate`, { accessToken });
//     const account = response.data;
//     accountSubject.next(account);
//     startAuthenticateTimer();
//     return account;
// }
