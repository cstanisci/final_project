import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../actions/types';

// loading - when we load a user, we want to make sure the loading is done - that we have already made a request to the backend and gotten a response

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

// Export function takes in a) state and b) action that is dispatched.
export default function(state = initialState, action) {
  const { type, payload } = action;

  //   If USER_LOADED is the case, then the token worked, and we are now logged in.  Set user to payload because payload includes name, email, avatar because in backend api/auth route we take everything except the password
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    //   Removes token and clears everything out.  We don't want to have an invalid token in local storage.
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
}
