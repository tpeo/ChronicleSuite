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

  const [metaAuthenticated, setMetaAuthStatus] = useState(constants.UNAUTHENTICATED);

  useEffect(() => {
    console.log('Checking Auth Status')
    facebookAccountService.getFacebookLoginStatus().then((authStatus) => {
      console.log('Auth Status: ' + authStatus)
      console.log('Checked Auth Status')
      setMetaAuthStatus(authStatus)
    })
    // TODO: Line 29 is reached asyncrhonously before 
    // authStatus is updated from getFacebookLoginStatus()
    console.log('Fetched Auth Status')
  }, [])

  return (
    <Router>
      <Routes>
        <Route path={constants.ROOT_PATH} element={(metaAuthenticated ? <Navigate to={constants.META_PAGE_INSIGHTS_PATH} /> :
          <Navigate to={constants.META_LOGIN_PATH} />)} />
        <Route exact path={constants.META_LOGIN_PATH} element={<MetaLogin />} />
        <Route exact path={constants.META_PAGE_INSIGHTS_PATH} element={<MetaPageInsights />} />
      </Routes>
    </Router>
  );
}

export default App;
