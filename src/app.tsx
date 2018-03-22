import '../styles/bootstrap.min.css';

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createHashHistory } from 'history'
import { Route, Redirect } from 'react-router'
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import * as _ from 'lodash'

import { IState } from './state'
import projectsScreenReducer from './projects-screen/store-creator'
import anomaliesScreenReducer from './anomalies-screen/store-creator'

import Projects from './projects-screen'
import Anomalies from './anomalies-screen'
import { rootSaga } from './root-saga'

let reducers = combineReducers<IState>({
  projectsScreen: projectsScreenReducer,
  anomaliesScreen: anomaliesScreenReducer,
  routing: routerReducer
})

let history = createHashHistory()
let routingMiddleware = routerMiddleware(history)

//let asyncMiddleware = thunk
let asyncMiddleware = createSagaMiddleware()

const store = createStore(reducers, applyMiddleware(routingMiddleware, asyncMiddleware))

asyncMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className='container'>
        <Route exact path="/" render={()=> (<Redirect to="/projects"/>)} />
        <Route path='/projects' component={Projects} />
        <Route path='/anomalies' component={Anomalies} />
      </div>
    </ConnectedRouter>
  </Provider>, document.getElementById('app'))

