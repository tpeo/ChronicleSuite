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
            <Route path="signup" element={<DefaultLayout></DefaultLayout>}>
              <Route index element={<SignupPage/>}></Route>
            </Route>
            <Route path="login" element={<FullscreenLayout></FullscreenLayout>}>
              <Route index element={<LoginPage/>}></Route>
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
