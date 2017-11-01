import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from './Link';

Navigation.propTypes = {
  isLoggedIn: PropTypes.bool,
};

Navigation.defaultProps = {
  isLoggedIn: false,
};

function Navigation({ isLoggedIn }) {
  const userLinks = (
    <div>
      <Link to="/upload">Upload</Link>
      <Link to="/logout">Log Out</Link>
    </div>
  );

  const guestLinks = <Link to="/login">Sign in / Sign up</Link>;

  return (
    <Container role="navigation">
      {isLoggedIn ? userLinks : guestLinks}
    </Container>
  );
}

const Container = styled.div`
  margin: 0;
  max-height: 40px;
`;

export default Navigation;
