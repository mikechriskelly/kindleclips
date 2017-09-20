import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

ErrorPage.propTypes = {
  error: PropTypes.shape({
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    stack: PropTypes.string.isRequired,
  }),
};

ErrorPage.defaultProps = {
  error: null,
};

function ErrorPage({ error }) {
  if (__DEV__ && error) {
    return (
      <Container>
        <Title>
          {error.name}
        </Title>
        <Message>
          {error.stack}
        </Message>
      </Container>
    );
  }
  return (
    <Container>
      <Title>Error</Title>
      <p>Sorry, a critical error occurred on this page.</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  height: 100%;
  font-family: sans-serif;
  text-align: center;
  color: #888;
`;

const Title = styled.h1`
  font-weight: 400;
  color: #555;
`;

const Message = styled.pre`
  white-space: pre-wrap;
  text-align: left;
`;

export default ErrorPage;
