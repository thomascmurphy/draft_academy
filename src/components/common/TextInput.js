import React from 'react';
import PropTypes from 'prop-types';

const TextInput = (props) => {
  let helpBlock = props.helpText ? <p className="help-block">{props.helpText}</p> : '';
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <div className="field">
        <input
          type="text"
          name={props.name}
          className="form-control"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          data-custom={props.customValue}
          maxLength={props.maxLength || 100}
          disabled={props.disabled}
          autoComplete={props.autoComplete===false ? "off" : "on"}/>
      </div>
      {helpBlock}
    </div>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  customValue: PropTypes.string
};

export default TextInput;
