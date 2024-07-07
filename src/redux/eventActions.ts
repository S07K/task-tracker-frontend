import {
    CREATE_MODAL_STATE,
    EDIT_MODAL_STATE,
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_REQUEST,
    FETCH_EVENTS_SUCCESS,
} from "./eventTypes";

export function fetchEventRequest() {
  return {
    type: FETCH_EVENTS_REQUEST,
  };
}
export function fetchEventFailure(error: any) {
  return {
    type: FETCH_EVENTS_FAILURE,
    payload: error,
  };
}
export function fetchEventSuccess(event: any) {
  return {
    type: FETCH_EVENTS_SUCCESS,
    payload: event,
  };
}
export function toggleEditModal(event: any) {
  return {
    type: EDIT_MODAL_STATE,
    payload: event,
  };
}
export function toggleCreateModal(event: any) {
  return {
    type: CREATE_MODAL_STATE,
    payload: event,
  };
}

  