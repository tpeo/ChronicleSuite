import './App.css';
import { facebookAccountService } from './_services/facebook.account.service';
import MetaLogin from './components/meta/MetaLogin'
import MetaPageInsights from './components/meta/MetaPageInsights';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from './pages/login/LoginPage.js'
import SignupPage from './pages/signup/SignupPage.js'
import * as constants from './constants'
import FullscreenLayout from './components/layouts/FullscreenLayout';
import DefaultLayout from './components/layouts/DefaultLayout';
import { MantineProvider, Global } from '@mantine/core';

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

  return (
        <Routes>
          <Route path="/">
            <Route path="login" element={<FullscreenLayout></FullscreenLayout>}>
              <Route index element={<LoginPage/>}></Route>
            </Route>
            <Route path="signup" element={<DefaultLayout></DefaultLayout>}>
              <Route index element={<SignupPage/>}></Route>
              <Route path="facebook" element={<LoginPage/>}></Route>
            </Route>
            <Route path="dashboard" element={<DefaultLayout tabs></DefaultLayout>}>
              <Route index element={<div>overview</div>}></Route>
              <Route path="overview" element={<div>overview</div>}></Route>
              <Route path="facebook" element={<div>facebook</div>}></Route>
              <Route path="instagram" element={<div>instagram</div>}></Route>
              <Route path="twitter" element={<div>twitter</div>}></Route>
            </Route>
          </Route>
        </Routes>
  );

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
