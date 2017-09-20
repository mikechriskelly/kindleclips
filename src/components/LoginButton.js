import React from 'react';
import PropTypes from 'prop-types';
import FaFacebook from 'react-icons/lib/fa/facebook';
import FaGoogle from 'react-icons/lib/fa/google';
import styled, { css } from 'styled-components';

LoginButton.propTypes = {
  type: PropTypes.string.isRequired,
};

LoginButton.defaultProps = {
  type: 'google',
};

function LoginButton({ type }) {
  const types = {
    facebook: {
      text: 'Facebook',
      to: '/login/facebook',
      icon: <FacebookIcon />,
      color: '#3b5998',
    },
    google: {
      text: 'Google',
      to: '/login/google',
      icon: <GoogleIcon />,
      color: '#dd4b39',
    },
  };

  return (
    <StyledButton
      href={types[type].to}
      style={{ background: types[type].color }}
    >
      {types[type].icon}
      Continue to {types[type].text}
    </StyledButton>
  );
}

//  Styling
const StyledButton = styled.a`
  border: transparent;
  border-radius: 2px;
  box-sizing: border-box;
  color: #fff;
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  margin: 0 5px;
  padding: 10px 20px;
  outline: 0;
  text-align: center;
  text-decoration: none;
  width: calc(100% - 20px);
  :hover {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  }
`;

const baseIcon = css`
  display: inline-block;
  fill: currentColor;
  height: 20px;
  margin: -2px 12px -2px 0;
  size: 24;
  vertical-align: middle;
  width: 20px;
`;

const FacebookIcon = styled(FaFacebook)`${baseIcon}`;
const GoogleIcon = styled(FaGoogle)`${baseIcon}`;

export default LoginButton;
