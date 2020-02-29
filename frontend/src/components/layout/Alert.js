import React from 'react';
import PropTypes from 'prop-types';
// Import Connect whenever you want to interact a component with Redux whether calling an action or getting the state.
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

// Get alert state (that we see in Redux Dev Tools) and fetch it into this component.  Mapping redux state to a prop in this component so that we have access to it
const mapStateToProps = state => ({
  //Name prop (alerts) and then use state. whatever we want to pull in from the root reducer.  In this case we want to do state.alert so we can get whatever state is inside the alert reducer
  alerts: state.alert
});

// When you bring in any state or action and want to use it, you have to pass it in to connect which takes in a)any state you want to map from alert or profile,etc. (ex.mapStateToProps) and b) an object with any actions to use.
export default connect(mapStateToProps)(Alert);
