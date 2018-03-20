import { Dispatch } from 'redux'

export const projectsScreenActionTypes = {
  TEST_ACTION: "TEST_ACTION"
}

export const projectScreenActionCreators = {
  test: () => {
    return (dispatch: Dispatch<{}>) => {
      dispatch({ type: projectsScreenActionTypes.TEST_ACTION, payload: "Something happend" })
    }
  }
}