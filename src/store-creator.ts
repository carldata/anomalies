
import { createHashHistory } from 'history';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { anomaliesScreenReducer } from './anomalies-screen/reducer';
import { projectsScreenReducer } from './projects-screen/reducer';
import { IState } from './state';

import { rootSaga } from './root-saga';
import { generalMessageModalContainerReducer } from './components/modal';
import { configurationReducer } from '@business-logic/configuration/reducers';

const reducers = combineReducers<IState>({
  anomaliesScreen: anomaliesScreenReducer,
  projectsScreen: projectsScreenReducer,
  modalState: generalMessageModalContainerReducer,
  configuration: configurationReducer,
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