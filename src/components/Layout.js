import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Header from '../containers/Header';
import constants from './constants';

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

function Layout({ children }) {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
}

const Container = styled.div`
  color: #222;
  font-weight: 100;
  font-size: 1em; /* ~16px; */
  font-family: ${constants.font};
  line-height: 1.7;
  margin: 0 auto;
  max-width: 750px;
  padding: 10px;
`;

export default Layout;
