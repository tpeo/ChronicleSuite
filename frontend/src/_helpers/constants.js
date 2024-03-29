export const FIREBASE_FUNCTIONS_URL = "http://127.0.0.1:5001";

export const USER_ID_UNKNOWN = null;

export const AUTHENTICATED = true;
export const UNAUTHENTICATED = false;

// Endpoints
export const POST_REQUEST = "POST";
export const GET_REQUEST = "GET";
export const ROOT_PATH = "/";
export const META_LOGIN_PATH = "/metaLogin";
export const META_PAGE_INSIGHTS_PATH = "metaPageInsights";
export const USER_ACCOUNTS_ENDPOINT_PATH = "/accounts";
export const PUBLISHED_POSTS_ENDPOINT_PATH = "/published_posts";
export const PAGE_POST_LIKES_TOTAL_ENDPOINT_PATH = '/insights/?metric=["post_reactions_by_type_total"]&access_token=';

export const ONE_SEC = 1000;

// API Response Errors
export const ERROR_RESPONSE = "ERROR_RESPONSE";
export const PAGE_NOT_FOUND = "PAGE_NOT_FOUND";

// User configuration
export const FLEXCEL_PAGE_NAME = "Flexcel";

// Indexing
export const PAGE_ID_INDEX = 0;
export const PAGE_ACCESS_TOKEN_INDEX = 1;

// Permissions
export const READ_INSIGHTS_PERMISSION = "read_insights";
export const PAGES_MANAGE_POSTS_PERMISSIONS = "pages_manage_posts";
export const PAGES_SHOW_LIST_PERMISSION = "pages_show_list";
export const PAGES_READ_ENGAGEMENT_PERMISSION = "pages_read_engagement";

export const LOGIN_PERMISSION_SCOPE = "read_insights,pages_manage_posts,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_engagement";

// Post Metadata
export const FACEBOOK_PLATFORM = "Facebook";

// Utils
export const CHAI_IMPORT = "chai";
export const HYPHEN = "-";

// Unit Tests
// getDateAndTimeFromISOTimestamp()
export const ISO_TIMESTAMP_0 = "2019-07-16T15:21:56+0000";
export const ISO_DATE_TIME_STR_0 = ["2019-7-16", "9:21 AM"];

const OAuthRedirectURI = "https://localhost:3000/callback";

export const metaOAuthProps = {
	platform: "meta",
	authorizeUrl: "https://www.facebook.com/v15.0/dialog/oauth",
	clientId: process.env.REACT_APP_META_CLIENT_ID,
	redirectUri: OAuthRedirectURI,
	accessTokenUrl: `${FIREBASE_FUNCTIONS_URL}/chroniclesuite/us-central1/default-meta-getAccessToken`,
	scope: ["pages_read_engagement"].join(","),
};
export const instagramOAuthProps = {
	platform: "instagram",
	authorizeUrl: "https://api.instagram.com/oauth/authorize",
	clientId: process.env.REACT_APP_INSTAGRAM_CLIENT_ID,
	redirectUri: OAuthRedirectURI,
	accessTokenUrl: `${FIREBASE_FUNCTIONS_URL}/chroniclesuite/us-central1/default-instagram-getAccessToken`,
	scope: ["user_profile", "user_media"].join(","),
};
export const twitterOAuthProps = {
	platform: "twitter",
	authorizeUrl: "https://twitter.com/i/oauth2/authorize",
	clientId: process.env.REACT_APP_TWITTER_CLIENT_ID,
	redirectUri: OAuthRedirectURI,
	accessTokenUrl: `${FIREBASE_FUNCTIONS_URL}/chroniclesuite/us-central1/default-twitter-getAccessToken`,
	scope: ["offline.access"].join(" "),
	useCodeChallenge: true,
};
