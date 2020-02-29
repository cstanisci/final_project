// Function that takes in state having to do with alerts and action.  An action will be dispatched from actions file.
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [];

// Once action is dispacteched from actions/alert.js to this reducer, the payload {msg, alerttype, id} are added to the state based on the type of alert it is
export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
