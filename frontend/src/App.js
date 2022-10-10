import Navigation from "./_helpers/Navigation";

function App(props) {
	// const [metaAuthStatus, setMetaAuthStatus] = useState(constants.UNAUTHENTICATED);

	// useEffect(() => {
	//   console.log('Checkinging Authentication Status');
	//   async function getFacebookAuthStatus() {
	//     var authStatus = await facebookAccountService.getFacebookLoginStatus();
	//     setMetaAuthStatus(authStatus);
	//     console.log('Authentication Status: ' + authStatus);
	//   }
	//   getFacebookAuthStatus();
	//   console.log('Fetched and set authentication status: ' + metaAuthStatus);
	// }, [])

	return <Navigation />;

	// if (metaAuthStatus) {
	//   return (
	//     <MetaPageInsights />
	//   );
	// } else {
	//   return (
	//     <MetaLogin />
	//   );
	// }
}

export default App;
