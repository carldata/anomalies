import { Dispatch } from 'redux'
import { push } from 'react-router-redux'

export const projectsScreenActionTypes = {
  TEST_ACTION: "TEST_ACTION",
  TEST_ASYNC_CALL_START: "TEST_ASYNC_CALL_START",
  TEST_ASYNC_CALL_FULFILED: "TEST_ASYNC_CALL_FULFILED",
  TEST_ASYNC_CALL_REJECTED: "TEST_ASYNC_CALL_REJECTED",
  GO_TO_ANOMALIES : "GO_TO_ANOMALIES"
}

export const projectScreenActionCreators = {
  test: () => {
    return { type: projectsScreenActionTypes.TEST_ACTION, payload: "It works" }
  },
  goToAnomaliesScreen: () => {
    return { type: projectsScreenActionTypes.GO_TO_ANOMALIES }
  },
  startTestAsyncCall: ()=>{
    return { type: projectsScreenActionTypes.TEST_ASYNC_CALL_START }
  }
}