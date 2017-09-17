import React from 'react';
import PropTypes from 'prop-types';
import history from '../../history';

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

Link.defaultProps = {
  onClick: null,
};

function Link({ to, children, onClick }) {
  const handleClick = event => {
    if (onClick) {
      onClick(event);
    }
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    if (event.defaultPrevented === true) {
      return;
    }
    event.preventDefault();
    history.push(to);
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}

// Helper Functions

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export default Link;
