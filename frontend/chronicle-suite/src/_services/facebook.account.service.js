import env from '../env'
import * as constants from './../constants'
import { utils } from './../_helpers/utils'

const facebookAppId = env.REACT_APP_FACEBOOK_APP_ID;

export const facebookAccountService = {
    login,
    initFacebookSdk,
    getFacebookLoginStatus,
    getPageInsights,
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
    // Waiting for SDK to load
    // Terrible code, should write signal 
    // to frontend that SDK has been loaded
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
        { scope: constants.LOGIN_PERMISSION_SCOPE }));
    if (!authResponse) return;
}
// Get page insights of the given 
// page name
async function getPageInsights(pageName) {
    // Get page accounts of user
    var accountsEndpoint = `/${window.FB.getAuthResponse().userID}${constants.USER_ACCOUNTS_ENDPOINT_PATH}`
    console.log(accountsEndpoint)
    window.FB.api(
        accountsEndpoint,
        function (response) {
            if (response && !response.error) {
                var pageIdAndAccessToken = utils.getPageIdAndAccessToken(response.data, pageName);
                var pageId = pageIdAndAccessToken[constants.PAGE_ID_INDEX];
                var pageAccessToken = pageIdAndAccessToken[constants.PAGE_ACCESS_TOKEN_INDEX];
                console.log(pageName + ' Posts');
                var publishedPostsEndpoint = `/${pageId}${constants.PUBLISHED_POSTS_ENDPOINT_PATH}`;
                window.FB.api(
                    publishedPostsEndpoint,
                    {access_token: pageAccessToken},
                    function (response) {
                        if (response && !response.error) {
                            console.log(response);
                        }
                    }
                );
            }
        }
    );
}


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
