import * as _ from 'lodash';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import { IState } from '../state';
import { getCookie } from '@common/cookie-auxiliary';

export const ifTokenIsEmptyGoToLogin = connectedRouterRedirect({
    redirectPath: '/login',
    allowRedirectBack: false,
    authenticatedSelector: (state: IState) => {
        const token: string = getCookie('fw_jwt');
        return token !== '';
    },
});

export const ifTokenNotEmptyGoToProjects = connectedRouterRedirect({
    redirectPath: '/projects',
    allowRedirectBack: false,
    authenticatedSelector: (state: IState) => {
        const token: string = getCookie('fw_jwt');
        return token === '';
    },
});