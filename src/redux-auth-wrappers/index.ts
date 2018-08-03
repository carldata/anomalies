import * as _ from 'lodash';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import { IState } from '../state';

export const isUserLoggedIn = connectedRouterRedirect({
    redirectPath: '/login',
    allowRedirectBack: false,
    authenticatedSelector: (state: IState) => !_.isEmpty(state.configuration.token),
});

export const ifUserLoggedInRedirectToProjects = connectedRouterRedirect({
    redirectPath: '/projects',
    allowRedirectBack: false,
    authenticatedSelector: (state: IState) => _.isEmpty(state.configuration.token),
});