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
  line-height: 1.375; /* ~22px */
  margin: 0 auto;
  max-width: 750px;
`;

export default Layout;
