import './App.css';
import { facebookAccountService } from './_services/facebook.account.service';
import MetaLogin from './components/meta/MetaLogin'
import MetaPageInsights from './components/meta/MetaPageInsights';
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
  Link,
} from "react-router-dom";
import { useEffect, useState } from 'react';

import * as constants from './constants'


function App() {

  const [metaAuthStatus, setMetaAuthStatus] = useState(constants.UNAUTHENTICATED);

  useEffect(() => {
    console.log('Checking Auth Status')
    facebookAccountService.getFacebookLoginStatus().then((authStatus) => {
      console.log('Auth Status: ' + authStatus)
      console.log('Checked Auth Status')
      setMetaAuthStatus(authStatus)
    })
    // TODO: Line 30 is reached asyncrhonously before 
    // authStatus is updated from getFacebookLoginStatus()
    // It is also a route path bug as well

    // TODO: Don't use routes - just use turnary operator 
    // to decide between Login and Insights page
    // You are not using routes properly...

    console.log('Fetched Auth Status: ' + metaAuthStatus)
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
