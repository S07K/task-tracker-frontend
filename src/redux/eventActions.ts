import {
  CREATE_MODAL_STATE,
  EDIT_MODAL_STATE,
  FETCH_EVENTS_FAILURE,
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
  TOKEN_STATE,
  USER_STATE,
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
export function setToken(event: any) {
  if (event) {
    localStorage.setItem("token", event);
  } else {
    localStorage.removeItem("token");
  }
  return {
    type: TOKEN_STATE,
    payload: event,
  };
}

export function setUser(event: any) {
  if (event) {
    localStorage.setItem("id", event);
  } else {
    localStorage.removeItem("id");
  }
  return {
    type: USER_STATE,
    payload: event,
  };
}

export function logOut(): any {
  return (dispatch: any) => {
    dispatch(setToken(""));
    dispatch(setUser(""));
    window.location.reload();
  };
}
