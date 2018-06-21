
import { createHashHistory } from 'history';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore, ReducersMapObject } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configurationReducer, ConfigurationActionTypes } from '@business-logic/configuration/reducers';
import { anomaliesScreenReducer } from './anomalies-screen/reducer';
import { projectsScreenReducer } from './projects-screen/reducer';
import { IState } from './state';
import { rootSaga } from './root-saga';
import { modalContainerReducer } from './components/modal';
import { IConfigurationState } from '@business-logic/configuration/models/state';

interface ICombinedReducers extends ReducersMapObject {
  configuration: (state: IConfigurationState, action: ConfigurationActionTypes) => IConfigurationState;
}

const reducers = combineReducers<IState>({
  configuration: configurationReducer,
  anomaliesScreen: anomaliesScreenReducer,
  projectsScreen: projectsScreenReducer,
  modalState: modalContainerReducer,
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