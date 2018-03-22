import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

export const projectsScreenActionTypes = {
  GO_TO_ANOMALIES : 'GO_TO_ANOMALIES',
  TEST_ACTION: 'TEST_ACTION',
  TEST_ASYNC_CALL_FULFILED: 'TEST_ASYNC_CALL_FULFILED',
  TEST_ASYNC_CALL_REJECTED: 'TEST_ASYNC_CALL_REJECTED',
  TEST_ASYNC_CALL_START: 'TEST_ASYNC_CALL_START',
};

export const projectScreenActionCreators = {
  goToAnomaliesScreen: () => {
    return { type: projectsScreenActionTypes.GO_TO_ANOMALIES };
  },
  startTestAsyncCall: () => {
    return { type: projectsScreenActionTypes.TEST_ASYNC_CALL_START };
  },
  test: () => {
    return { type: projectsScreenActionTypes.TEST_ACTION, payload: 'It works' };
  },
};