import { delay } from "redux-saga";
import { call, fork, put, race, take, takeEvery } from 'redux-saga/effects'
import { makeGetRequest } from "services/networking/request";
import { ActionType, getType } from "typesafe-actions";
import { fetchAuditStatusHistoriesAction, pollAuditStatusHistoriesAction, stopPollingAuditStatusHistoriesAction } from "./actions";
import { modelizeApiAuditStatusHistoriesToById, modelizeApiAuditStatusHistoriesToByPageOrScriptIdAndAuditParametersId } from "./modelizer";
import { ApiAuditStatusHistoryType } from "./types";


export function* fetchAuditStatusHistories(action: ActionType<typeof fetchAuditStatusHistoriesAction.request>) {
    try {
        const endpoint = `/api/audits/${action.payload.auditId}/status`;
        const { body: auditStatusHistory }: { body: ApiAuditStatusHistoryType } = yield call(
            makeGetRequest,
            endpoint,
            true,
            null,
        );
        yield put(fetchAuditStatusHistoriesAction.success({
            byId: modelizeApiAuditStatusHistoriesToById([auditStatusHistory]),
            byPageOrScriptIdAndAuditParametersId: modelizeApiAuditStatusHistoriesToByPageOrScriptIdAndAuditParametersId([auditStatusHistory]),
        }));
    } catch (error) {
        yield put(fetchAuditStatusHistoriesAction.failure({ errorMessage: error.toString() }));
        return;
    };
};


function* pollAuditStatusHistories(auditId: string) {
    try {
        const endpoint = `/api/audits/${auditId}/status`;
        const { body: auditStatusHistory }: { body: ApiAuditStatusHistoryType } = yield call(makeGetRequest, endpoint, true, null);

        // save the response to the store before continuing the polling
        yield put(fetchAuditStatusHistoriesAction.success({
            byId: modelizeApiAuditStatusHistoriesToById([auditStatusHistory]),
            byPageOrScriptIdAndAuditParametersId: modelizeApiAuditStatusHistoriesToByPageOrScriptIdAndAuditParametersId([auditStatusHistory]),
        }));

        const pollingIsFinished = (auditStatusHistory.status === "SUCCESS" || auditStatusHistory.status === "ERROR");
        if (pollingIsFinished) {
            yield put(stopPollingAuditStatusHistoriesAction({}));
        }
        else {
            // wait for 10 seconds before the next polling
            yield call(delay, 10000);
            yield put(pollAuditStatusHistoriesAction({ auditId }))
        };
    } catch (error) {
        yield put(fetchAuditStatusHistoriesAction.failure({ errorMessage: error.toString() }));
        return;
    };
};

function* watchPollAuditStatusHistories() {
    while (true) {
        const pollAction: ActionType<typeof pollAuditStatusHistoriesAction> = yield take(pollAuditStatusHistoriesAction);
        const auditId = pollAction.payload.auditId;
        if (!auditId) {
            return;
        }
        yield race({
            continuePolling: fork(pollAuditStatusHistories, auditId),
            stopPolling: take(stopPollingAuditStatusHistoriesAction)
        });
    };
};

export default function* auditStatusHistoriesSagas() {
    yield takeEvery(
        getType(fetchAuditStatusHistoriesAction.request),
        fetchAuditStatusHistories,
    );
    yield watchPollAuditStatusHistories();
};
