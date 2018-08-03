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


store.dispatch(_.toPlainObject(new ConfigurationLoadStartedAction()));

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div >
        <Route exact path='/login' component={() => {
          window.location.href = `http://beta.flowworks.com/login.aspx?externalUrl=http://${window.location.host}`;
          return null;
        }} />
        <Route exact path='/access_token/:token' render={(props) => {
          store.dispatch(_.toPlainObject(new SetTokenStartedAction(props.match.params.token)));
          return null;
        }} />
        <Route
          exact
          path='/'
          render={() => (<Redirect to='/projects' />)} />
        <Route
          path='/projects'
          component={Projects} />
        <Route
          path='/anomalies'
          component={Anomalies} />
      </div>
    </ConnectedRouter>
  </Provider>, document.getElementById('app'));

