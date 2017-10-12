import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../common/TextInput';

class EmailForm extends React.Component {

  render() {
    return (
      <form>
        <TextInput
          name="email"
          label="Your Email"
          value={this.props.email}
          onChange={this.props.onChange}/>

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
  email: PropTypes.string
};

export default EmailForm;
