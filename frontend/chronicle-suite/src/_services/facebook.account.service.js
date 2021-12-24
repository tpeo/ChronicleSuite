import env from '../env'
import * as constants from './../constants'

const facebookAppId = env.REACT_APP_FACEBOOK_APP_ID;

export const facebookAccountService = {
    login,
    initFacebookSdk,
    getFacebookLoginStatus,
};

// Loads the Facebook SDK into the
// browser
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

// Retrieves the login status of the 
// current user
async function getFacebookLoginStatus() {
    await delay(constants.ONE_SEC);
    var status = constants.UNAUTHENTICATED;

    window.FB.getLoginStatus((response) => {
        if (response.authResponse) {
            console.log('Getting user info...')
            window.FB.api('/me', function (response) {
                console.log('Good to see you, ' + response.name + '.');
            });
            status = constants.AUTHENTICATED
        }
    });

    return status;    
}


async function login() {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(window.FB.login);
    if (!authResponse) return;
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
