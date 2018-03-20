import { Dispatch } from 'redux'
import { push } from 'react-router-redux'

export const anomaliesScreenActionTypes = {
  ANOMALY_TEST_ACTION: "ANOMALY_TEST_ACTION"
}

export const anomaliesScreenActionCreators = {
  test: () => (dispatch: Dispatch<{}>) => {
    dispatch({ type: anomaliesScreenActionTypes.ANOMALY_TEST_ACTION, payload: "Text changed" })
  },
  goBackToProjectsScreen: () => (dispatch: Dispatch<{}>) => {
    dispatch(push("/projects"))
  }
}