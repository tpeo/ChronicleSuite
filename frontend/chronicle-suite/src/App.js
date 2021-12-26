import './App.css';
import { facebookAccountService } from './_services/facebook.account.service';
import MetaLogin from './components/meta/MetaLogin'
import MetaPageInsights from './components/meta/MetaPageInsights';
import { useEffect, useState } from 'react';

import * as constants from './constants'

function App() {
  const [metaAuthStatus, setMetaAuthStatus] = useState(constants.UNAUTHENTICATED);

  useEffect(() => {
    console.log('Checkinging Authentication Status')
    facebookAccountService.getFacebookLoginStatus().then((authStatus) => {
      console.log('Authentication Status: ' + authStatus)
      setMetaAuthStatus(authStatus)
    })
    console.log('Fetched Authentication Status: ' + metaAuthStatus)
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
