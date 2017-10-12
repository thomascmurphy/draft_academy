import React from 'react';
import PropTypes from 'prop-types';

const CheckBox = ({name, label, onChange, value, customField, customValue}) => {
  return (
    // <div class="checkbox">
    //   <label>
    //     <input
    //       type="checkbox"
    //       name={name}
    //       value={value}
    //       onChange={onChange}
    //       data-custom={customValue} /> {label}
    //   </label>
    // </div>
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="field">
        <input
          type="checkbox"
          name={name}
          value={value}
          onChange={onChange}
          data-custom={customValue} />
      </div>
    </div>
  );
};

CheckBox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  customValue: PropTypes.string
};

export default CheckBox;
