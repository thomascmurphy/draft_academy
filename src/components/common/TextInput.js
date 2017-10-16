import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({name, label, onChange, placeholder, value, customValue, maxLength=100, helpText=null}) => {
  let helpBlock = helpText ? <p className="help-block">{helpText}</p> : '';
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="field">
        <input
          type="text"
          name={name}
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          data-custom={customValue}
          maxLength={maxLength}/>
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
