import env from '../env'
import axios from 'axios';

import { facebookAccountService } from '../_services/facebook.account.service';

export function jwtInterceptor() {
    // axios.interceptors.request.use(request => {
    //     // add auth header with jwt if account is logged in and request is to the api url
    //     const account = facebookAccountService.accountValue;
    //     const isLoggedIn = account?.token;
    //     const isApiUrl = request.url.startsWith(env.REACT_APP_API_URL);

    //     if (isLoggedIn && isApiUrl) {
    //         request.headers.common.Authorization = `Bearer ${account.token}`;
    //     }

    //     return request;
    // });
}