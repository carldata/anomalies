import '../styles/bootstrap.min.css';

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createHashHistory } from 'history'

import { IState } from './state'
import projectsScreenReducer from './projects-screen/store-creator'

import { Projects } from './projects-screen'

let reducers = combineReducers<IState>({
  projectsScreen: projectsScreenReducer
})

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <div className='container'>
      <Projects />
    </div>
  </Provider>, document.getElementById('app'))