import env from '../env'
import * as constants from './../constants'

const facebookAppId = env.REACT_APP_FACEBOOK_APP_ID;

export const facebookAccountService = {
    login,
    initFacebookSdk,
    getFacebookLoginStatus,
    getUserPageAccounts,
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
            window.FB.api(
                '/me',
                'GET',
                { "fields": "id,name,email" },
                function (response) {
                    console.log('Good to see you, ' + response.name);
                    console.log(response)
                }
            );
            status = constants.AUTHENTICATED
        }
    });
    return status;
}

// Login with facebook then authenticate with 
// the API to get a JWT auth token
async function login() {
    const { authResponse } = await new Promise(window.FB.login(() => { },
        { scope: 'read_insights, pages_show_list, pages_read_engagement' }));
    if (!authResponse) return;
}

// Gets the Page Account data of the 
// current meta user 
async function getUserPageAccounts() {
    var accountsEndpoint = `/${window.FB.getAuthResponse().userID}/accounts`
    window.FB.api(
        accountsEndpoint,
        function (response) {
            if (response && !response.error) {
                // Get Page meta data
            }
        }
    );
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
