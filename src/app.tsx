import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import '../styles/bootstrap.min.css';
import '../styles/index.css';

import Anomalies from './anomalies-screen';
import Projects from './projects-screen';
import { store, history } from './store-creator';
import { ConfigurationLoadStartedAction, SetTokenStartedAction } from '@business-logic/configuration/actions';
import { IState } from './state';
import { ifUserLoggedInRedirectToProjects, isUserLoggedIn } from './redux-auth-wrappers';

store.dispatch(_.toPlainObject(new ConfigurationLoadStartedAction()));


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div >
        <Route exact path='/login' component={ifUserLoggedInRedirectToProjects(() => {
          console.log('apiAddress: ', (store.getState() as IState).configuration.apiAddress);
          window.location.href = `http://beta.flowworks.com/login.aspx?externalUrl=http://${window.location.host}`;
          return <div>Loading</div>;
        })} />
        <Route exact path='/access_token/:token' render={(props) => {
          store.dispatch(_.toPlainObject(new SetTokenStartedAction(props.match.params.token)));
          return <div>Loading</div>;
        }} />
        <Route
          exact
          path='/'
          render={() => (<Redirect to='/projects' />)} />
        <Route
          path='/projects'
          component={isUserLoggedIn(Projects as React.ComponentClass<any>)} />
        <Route
          path='/anomalies'
          component={isUserLoggedIn(Anomalies as React.ComponentClass<any>)} />
      </div>
    </ConnectedRouter>
  </Provider>, document.getElementById('app'));

