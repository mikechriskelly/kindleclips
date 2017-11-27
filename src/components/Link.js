import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import history from '../history';
import constants from './constants';

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
    <StyledA href={to} onClick={handleClick}>
      {children}
    </StyledA>
  );
}

// Helper Functions

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const StyledA = styled.a`
  color: ${constants.color.link};
  :visited {
    color: ${constants.color.link};
  }
  text-decoration: none;
`;

export default Link;
