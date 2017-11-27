import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Link from './Link';

Button.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  isServerSideOnly: PropTypes.bool,
};

Button.defaultProps = {
  isServerSideOnly: false,
};

function Button({ label, href, onClick, isServerSideOnly }) {
  let button;
  if (isServerSideOnly) {
    button = (
      <StyledA href={href}>
        {label}
      </StyledA>
    );
  } else if (href) {
    button = (
      <StyledLink to={href}>
        {label}
      </StyledLink>
    );
  } else {
    button = (
      <StyledButton onClick={onClick}>
        {label}
      </StyledButton>
    );
  }
  return button;
}

//  Styling
const styles = css`
  background: { props => props.primary ? '#999' : '#333' }
  border-radius: 2px;
  box-sizing: border-box;
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  margin: 0 5px;
  padding: 2px 4px;
  outline: 0;
  text-align: center;
  text-decoration: none;
`;

const StyledA = styled.a`${styles};`;
const StyledLink = styled(Link)`${styles}`;
const StyledButton = styled.button`${styles};`;

export default Button;
