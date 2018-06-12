
import { createHashHistory } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Route } from 'react-router';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';

import '../styles/bootstrap.min.css';
import Anomalies from './anomalies-screen';
import Projects from './projects-screen';
import { store, history } from './store-creator';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div >
        <Route exact path='/' render={() => (<Redirect to='/projects' />)} />
        <Route path='/projects' component={Projects} />
        <Route path='/anomalies' component={Anomalies} />
      </div>
    </ConnectedRouter>
  </Provider>, document.getElementById('app'));

