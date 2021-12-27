import './App.css';
import { facebookAccountService } from './_services/facebook.account.service';
import MetaLogin from './components/meta/MetaLogin'
import MetaPageInsights from './components/meta/MetaPageInsights';
import { useEffect, useState } from 'react';

import * as constants from './constants'

function App() {
  const [metaAuthStatus, setMetaAuthStatus] = useState(constants.UNAUTHENTICATED);

  useEffect(() => {
    console.log('Checkinging Authentication Status');
    async function getFacebookAuthStatus() {
      var authStatus = await facebookAccountService.getFacebookLoginStatus();
      setMetaAuthStatus(authStatus);
      console.log('Authentication Status: ' + authStatus);
    }
    getFacebookAuthStatus();
    console.log('Fetched and set authentication status: ' + metaAuthStatus);
  }, [])

  if (metaAuthStatus) {
    return (
      <MetaPageInsights />
    );
  } else {
    return (
      <MetaLogin />
    );
  }
}

export default App;
