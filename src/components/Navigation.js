import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FaUpload from 'react-icons/lib/fa/upload';
import FaSignOut from 'react-icons/lib/fa/sign-out';
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
      <Link to="/upload">
        <FaUpload />
      </Link>
      <a href="/logout">
        <FaSignOut />
      </a>
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
