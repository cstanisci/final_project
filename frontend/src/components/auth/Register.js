import React, { Fragment, useState } from 'react';
// Import Connect whenever you want to interact a component with Redux whether calling an action or getting the state.
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

// Connect actions (alert and auth actions) to component - in order to use, you need to add to connect function at the bottom, add as props, and add to propTypes
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  // formData is state, setFormData is equivalent to this.setState where you pass the new values in
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  // Destructure so you don't have to reference using formData.name, etc.
  const { name, email, password, password2 } = formData;

  //   Use onChange for every field.  e.target.name allows us to change the key being update based on the name of the input
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      // Pass message and type through to actions/alert.js which will in turn generate ID, and dispatch SET_ALERT with the msg, alerttype, and id
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            // minLength='6'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            // minLength='6'
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

// When you bring in an action (setAlert) and want to use it, you have to pass it in to connect which takes in a)any state you want to map from alert or profile,etc. and b) an object with any actions to use.  Allows you to access props.setAlert
export default connect(mapStateToProps, { setAlert, register })(Register);
