import {
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_REQUEST,
    FETCH_EVENTS_SUCCESS,
    EDIT_MODAL_STATE,
    CREATE_MODAL_STATE,
    TOKEN_STATE,
    USER_STATE,
  } from "./eventTypes";
  
  const initialState = {
    isEditModalOpen: false,
    isCreateModalOpen: false,
    loading: false,
    events: [],
    error: "",
    token: "",
    userId: "",
  };
  
  const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case FETCH_EVENTS_REQUEST:
        return { ...state, loading: true };
      case FETCH_EVENTS_FAILURE:
        return { ...state, loading: false, error: action.payload, events: [] };
      case FETCH_EVENTS_SUCCESS:
        return { ...state, loading: false, error: "", events: action.payload };
      case EDIT_MODAL_STATE:
        return { ...state, isEditModalOpen: action.payload };
      case CREATE_MODAL_STATE:
        return { ...state, isCreateModalOpen: action.payload };
      case TOKEN_STATE:
        return { ...state, token: action.payload };
      case USER_STATE:
        return { ...state, userId: action.payload };
      default:
        return state;
    }
  };
  export default userReducer;