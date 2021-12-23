import env from '../env'
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import { browserHistory } from '../_helpers/browserHistory'

import * as constants from './../constants'

const facebookAppId = env.REACT_APP_FACEBOOK_APP_ID;
const baseUrl = `${env.REACT_APP_API_URL}/accounts`;
const accountSubject = new BehaviorSubject(null);

export const facebookAccountService = {
    login,
    initFacebookSdk,
    getFacebookLoginStatus,
};


async function initFacebookSdk() {
    return new Promise(resolve => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v12.0'
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
        console.log('Integrated Facebook SDK!')
        resolve();
    });
}


async function getFacebookLoginStatus() {
    await delay(constants.ONE_SEC);
    var status = constants.UNAUTHENTICATED;

    window.FB.getLoginStatus((response) => {
        if (response.authResponse) {
            console.log('Getting user info...')
            window.FB.api('/me', function (response) {
                console.log('Good to see you, ' + response.name + '.');
            });
            console.log('User already logged in...')
            status = constants.AUTHENTICATED
        }
    });

    return status;    
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


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
