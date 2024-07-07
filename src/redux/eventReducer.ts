import {
    FETCH_EVENTS_FAILURE,
    FETCH_EVENTS_REQUEST,
    FETCH_EVENTS_SUCCESS,
    EDIT_MODAL_STATE,
    CREATE_MODAL_STATE,
  } from "./eventTypes";
  
  const initialState = {
    isEditModalOpen: false,
    isCreateModalOpen: false,
    loading: false,
    events: [],
    error: "",
  };
  
  const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case FETCH_EVENTS_REQUEST:
        return { ...state, loading: true };
      case FETCH_EVENTS_FAILURE:
        return { loading: false, error: action.payload, events: [] };
      case FETCH_EVENTS_SUCCESS:
        return { loading: false, error: "", events: action.payload };
      case EDIT_MODAL_STATE:
        return { isEditModalOpen: action.payload };
      case CREATE_MODAL_STATE:
        return { isCreateModalOpen: action.payload };
      default:
        return state;
    }
  };
  export default userReducer;