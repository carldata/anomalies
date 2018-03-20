import { Dispatch } from 'redux'

export const anomaliesScreenActionTypes = {
  ANOMALY_TEST_ACTION: "ANOMALY_TEST_ACTION"
}

export const anomaliesScreenActionCreators = {
  test: () => (dispatch: Dispatch<{}>) => {
    dispatch({ type: anomaliesScreenActionTypes.ANOMALY_TEST_ACTION, payload: "whatever man" })
  },
  goBackToProjectsScreen: () => (dispatch: Dispatch<{}>) => {
    console.log("Hello my dear friend")
  }
}