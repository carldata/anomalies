import { Dispatch } from 'redux'
import { push } from 'react-router-redux'
import { put } from 'redux-saga/effects'

export const anomaliesScreenActionTypes = {
  ANOMALY_TEST_ACTION: "ANOMALY_TEST_ACTION",
  GO_TO_PROJECTS: "GO_TO_PROJECTS"
}

export const anomaliesScreenActionCreators = {
  // test: () => (dispatch: Dispatch<{}>) => {
  //   dispatch({ type: anomaliesScreenActionTypes.ANOMALY_TEST_ACTION, payload: "Text changed" })
  // },
  // goBackToProjectsScreen: () => (dispatch: Dispatch<{}>) => {
  //   dispatch(push("/projects"))
  // },
  goToProjectsScreen: function(){
    return { type: anomaliesScreenActionTypes.GO_TO_PROJECTS }
  }
}