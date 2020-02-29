// Adding global header
// Function that takes in a token.  If the token is there, then it will add it to the headers, if not, it will delete it from the headers.  This way we will send token with every request and based on the request it will either add to the header or not.

import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
