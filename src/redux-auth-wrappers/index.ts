import * as _ from 'lodash';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import { IState } from '../state';
import { getCookie } from '@common/cookie-auxiliary';

export const ifTokenIsEmptyGoToLogin = connectedRouterRedirect({
    redirectPath: '/login',
    allowRedirectBack: false,
    authenticatedSelector: (state: IState) => {
        // console.log('ifTokenIsEmptyGoToLogin', state.configuration.token !== '');
        const token: string = getCookie('fw_jwt');
        return token !== '';
    },
});

export const ifTokenNotEmptyGoToProjects = connectedRouterRedirect({
    redirectPath: '/projects',
    allowRedirectBack: false,
    authenticatedSelector: (state: IState) => {
        // console.log('Getting Cookies...');
        // console.log('fw_jwt cookie:, ', getCookie('fw_jwt'));
        // console.log('Is cookie token empty: ', _.isEmpty(getCookie('fw_jwt')));
        // return _.isEmpty(getCookie('fw_jwt'));
        // console.log('ifTokenNotEmptyGoToProjects: ', state.configuration.token === '');
        const token: string = getCookie('fw_jwt');
        return token === '';
    },
});