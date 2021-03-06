import { fork } from 'redux-saga/effects';

import {
  watchFetchMolecules,
  watchFetchMolecule,
  watchFetchMoleculeById,
  watchFetchCalculationById,
  watchFetchOrbital,
  watchNotification,
  watchFetchTaskFlow,
  watchFetchJob,
  watchNotifications,
  watchLoadNotebooks,
  watchRedirectToJupyterHub,
  watchInvalidateSession,
  watchLoadCalculationNotebooks,
  watchLoadCalculations
} from '@openchemistry/sagas';

import { auth } from '@openchemistry/girder-redux';

export default function* root() {
  yield fork(watchFetchMolecules)
  yield fork(watchFetchMolecule)
  yield fork(watchFetchMoleculeById)
  yield fork(watchFetchCalculationById)
  yield fork(watchFetchOrbital)
  yield fork(watchNotification)
  yield fork(watchFetchTaskFlow)
  yield fork(watchFetchJob)
  yield fork(watchNotifications)
  yield fork(watchLoadNotebooks)
  yield fork(watchRedirectToJupyterHub)
  yield fork(watchInvalidateSession)
  yield fork(watchLoadCalculationNotebooks)
  yield fork(watchLoadCalculations)

  yield fork(auth.sagas.watchAuthenticate);
  yield fork(auth.sagas.watchFetchMe);
  yield fork(auth.sagas.watchFetchOauthProviders);
  yield fork(auth.sagas.watchTestOauthEnabled);
  yield fork(auth.sagas.watchInvalidateToken);
  yield fork(auth.sagas.watchNewToken);
  yield fork(auth.sagas.watchUsernameLogin);
  yield fork(auth.sagas.watchNerscLogin);
}
