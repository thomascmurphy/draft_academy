import React from 'react';
import PropTypes from 'prop-types';

const NumberInput = (props) => {
  let helpBlock = props.helpText ? <p className="help-block">{props.helpText}</p> : '';
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <div className="field">
        <input
          type="number"
          name={props.name}
          className="form-control"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          data-custom={props.customValue}
          max={props.max}
          min={props.min}/>
      </div>
      {helpBlock}
    </div>
  );
};

NumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.number,
  customValue: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number
};

export default NumberInput;
