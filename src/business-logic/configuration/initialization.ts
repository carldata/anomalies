import { getConfigurationSaga } from './sagas';

export function* initializationSaga() {
  yield getConfigurationSaga();
}