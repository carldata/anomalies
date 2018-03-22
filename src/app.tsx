import '../styles/bootstrap.min.css';

import { createHashHistory } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Route } from 'react-router';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import anomaliesScreenReducer from './anomalies-screen/store-creator';
import projectsScreenReducer from './projects-screen/store-creator';
import { IState } from './state';

import Anomalies from './anomalies-screen';
import Projects from './projects-screen';

import { rootSaga } from './root-saga';

const reducers = combineReducers<IState>({
  anomaliesScreen: anomaliesScreenReducer,
  projectsScreen: projectsScreenReducer,
  routing: routerReducer,
});

const history = createHashHistory();
const routingMiddleware = routerMiddleware(history);
const asyncMiddleware = createSagaMiddleware();

const store = createStore(reducers, applyMiddleware(routingMiddleware, asyncMiddleware));

asyncMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className='container'>
        <Route exact path='/' render={() => (<Redirect to='/projects' />)} />
        <Route path='/projects' component={Projects} />
        <Route path='/anomalies' component={Anomalies} />
      </div>
    </ConnectedRouter>
  </Provider>, document.getElementById('app'));

