import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// Action called setAlert that dispatches the type of SET_ALERT to the alert.js reducer and going to add the alert to the state, which is initially an empty array
export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id
      }),
    timeout
  );
};
