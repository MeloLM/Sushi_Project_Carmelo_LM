import React from 'react';
import PropTypes from 'prop-types';

const Toast = ({ show, message, type }) => {
  if (!show) return null;

  const typeClasses = {
    success: 'toast-success',
    warning: 'toast-warning',
    info: 'toast-info',
    error: 'toast-error'
  };

  return (
    <div className={`toast-notification ${typeClasses[type] || 'toast-success'}`}>
      <div className="toast-content">
        {type === 'success' && <i className="bi bi-check-circle me-2"></i>}
        {type === 'warning' && <i className="bi bi-exclamation-triangle me-2"></i>}
        {type === 'info' && <i className="bi bi-info-circle me-2"></i>}
        {type === 'error' && <i className="bi bi-x-circle me-2"></i>}
        {message}
      </div>
    </div>
  );
};

Toast.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'info', 'error'])
};

Toast.defaultProps = {
  type: 'success'
};

export default Toast;
