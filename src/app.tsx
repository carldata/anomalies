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
import { ifTokenNotEmptyGoToProjects, ifTokenIsEmptyGoToLogin } from './redux-auth-wrappers';
import { setCookie } from '@common/cookie-auxiliary';
import { ConfigurationLoadStartedAction } from '@business-logic/configuration/actions';

store.dispatch(_.toPlainObject(new ConfigurationLoadStartedAction()))

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faTrashAlt, faEdit, faPlusCircle, faSync, faAngleLeft, faFileExport } from '@fortawesome/pro-light-svg-icons';
library.add(faCog, faTrashAlt, faEdit, faPlusCircle, faSync, faAngleLeft, faFileExport);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div >
        <Route exact path='/login' component={ifTokenNotEmptyGoToProjects(() => {
          // TODO - change this hardcoded beta address to url from some configuration
          window.location.href = `http://beta.flowworks.com/login.aspx?externalUrl=http://${window.location.host}`;
          return <div>Loading</div>;
        })} />
        <Route exact path='/access_token/:token' render={(props) => {
          setCookie('fw_jwt', props.match.params.token, 120);
          history.push('/projects');
          return <div>Loading</div>;
        }} />
        <Route
          exact
          path='/'
          render={() => (<Redirect to='/projects' />)} />
        <Route
          path='/projects'
          component={ifTokenIsEmptyGoToLogin(Projects as React.ComponentClass<any>)} />
        <Route
          path='/anomalies'
          component={ifTokenIsEmptyGoToLogin(Anomalies as React.ComponentClass<any>)} />
      </div>
    </ConnectedRouter>
  </Provider>, document.getElementById('app'));

