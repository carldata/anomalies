
import { createHashHistory } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Route } from 'react-router';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { anomaliesScreenReducer } from './anomalies-screen/reducer';
import { projectsScreenReducer } from './projects-screen/reducer';
import { IState } from './state';

import { rootSaga } from './root-saga';
import { GeneralMessageModalContainer, generalMessageModalContainerReducer } from './components/modal';

const reducers = combineReducers<IState>({
  anomaliesScreen: anomaliesScreenReducer,
  projectsScreen: projectsScreenReducer,
  modalState: generalMessageModalContainerReducer,
  routing: routerReducer,
});

const history = createHashHistory();
const routingMiddleware = routerMiddleware(history);
const asyncMiddleware = createSagaMiddleware();

// tslint:disable-next-line:no-string-literal
const composeEnchancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const enchancer = composeEnchancers(applyMiddleware(routingMiddleware, asyncMiddleware));
const store = createStore(reducers, enchancer);

asyncMiddleware.run(rootSaga);

export {
  history,
  store,
};