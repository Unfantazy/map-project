import React from 'react';

const CheckBox = ({
                      title = '', className = '', type = 'checkbox', style = {}, ...props
                  }) => (
    <label className={`form-checkbox-custom ${className}`} style={style}>
        <input type={type} {...props} />
        <span className="form-label"
              style={!title ? {paddingLeft: 9} : {}}
        >&nbsp;{title}</span>
    </label>
);

CheckBox.defaultProps = {
    className: '',
}

export default CheckBox;
