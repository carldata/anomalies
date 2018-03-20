import { Dispatch } from 'redux'
import { push } from 'react-router-redux'

export const projectsScreenActionTypes = {
  TEST_ACTION: "TEST_ACTION"
}

export const projectScreenActionCreators = {
  test: () => {
    return (dispatch: Dispatch<{}>) => {
      dispatch({ type: projectsScreenActionTypes.TEST_ACTION, payload: "It works" })
    }
  },
  goToAnomaliesScreen: () => {
    return (dispatch: Dispatch<{}>) => {
      dispatch(push('/anomalies'))
    }
  }
}