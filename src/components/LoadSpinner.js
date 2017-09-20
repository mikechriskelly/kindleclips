import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

LoadSpinner.propTypes = { clear: PropTypes.bool };
LoadSpinner.defaultProps = { clear: false };

function LoadSpinner({ clear }) {
  return (
    <Container clear={clear}>
      <Wheel />
    </Container>
  );
}

const Container = styled.div`
  background-color: ${props =>
    props.clear ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.5)'};
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Wheel = styled.div`
  animation: ${rotate360} 2s linear infinite;
  border-color: #ccc transparent;
  border-radius: 50%;
  border-style: double;
  border-width: 30px;
  height: 20px;
  left: 50%;
  margin-left: -40px;
  margin-top: -40px;
  position: absolute;
  top: 50%;
  width: 20px;
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default LoadSpinner;
