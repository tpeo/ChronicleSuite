import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initFacebookSdk } from './_helpers/initFacebookSDK'
import { jwtInterceptor } from './_helpers/jwtInterceptor'
import { errorInterceptor } from './_helpers/errorInterceptor';

import { facebookAccountService } from './_services/facebook.account.service'

// Require and configure dotenv
// require('dotenv').config()

jwtInterceptor();
errorInterceptor();

// Load facebook sdk, then start React App
facebookAccountService.initFacebookSdk().then(startApp);

function startApp() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
