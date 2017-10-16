import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../common/TextInput';

class EmailForm extends React.Component {

  render() {
    return (
      <form>
        <div className="row">
          <div className="col-sm-6">
            <TextInput
              name="email"
              label="Your Email"
              value={this.props.email}
              onChange={this.props.onChange}/>
          </div>
          <div className="col-sm-6">
            <TextInput
              name="pin"
              label="PIN"
              value={this.props.pin}
              onChange={this.props.onChange}
              maxLength={4}
              helpText="Will set a PIN for future logins if none exists"/>
          </div>
        </div>
        <input
          type="submit"
          disabled={this.props.saving}
          className="btn btn-primary"
          onClick={this.props.onSave}/>
      </form>
  );
  }
}

EmailForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  email: PropTypes.string,
  pin: PropTypes.string
};

export default EmailForm;
