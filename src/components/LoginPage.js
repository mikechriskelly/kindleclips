import React from 'react';
import styled from 'styled-components';
import LoginButton from './LoginButton';

function LoginPage() {
  return (
    <OuterContainer>
      <InnerContainer>
        <h3>Log In</h3>
        <LoginButton type="facebook" />
        <Line>OR</Line>
        <LoginButton type="google" />
      </InnerContainer>
    </OuterContainer>
  );
}

const OuterContainer = styled.div`
  position: absolute;
  top: 25%;
  width: 100%;
`;

const InnerContainer = styled.div`
  background-color: var(--white-base);
  border-radius: 5px;
  margin: auto;
  max-width: 350px;
  padding: 20px 25px 25px;
  text-align: center;
`;

const Line = styled.strong`
  color: var(--gray-light);
  display: block;
  font-size: 80%;
  margin: 10px 0;
  position: relative;
  text-align: center;
  width: 100%;
  z-index: 1;
  ::before {
    background-color: #fff;
    content: '';
    height: 10px;
    left: 50%;
    margin-left: -20px;
    margin-top: -5px;
    position: absolute;
    top: 50%;
    width: 40px;
    z-index: -1;
  }
  ::after {
    border-bottom: 1px solid #ddd;
    content: '';
    display: block;
    position: absolute;
    top: 49%;
    width: 100%;
    z-index: -2;
  }
`;

export default LoginPage;
