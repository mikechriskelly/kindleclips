import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

Navigation.propTypes = {
  className: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

Navigation.defaultProps = {
  className: '',
  isLoggedIn: false,
};

function Navigation({ className, isLoggedIn }) {
  const userLinks = (
    <div>
      <Link to="/upload">Upload</Link>
      <Link to="/logout">Log Out</Link>
    </div>
  );

  const guestLinks = <Link to="/login">Sign in / Sign up</Link>;

  return (
    <div className={cx(s.root, className)} role="navigation">
      {isLoggedIn ? userLinks : guestLinks}
    </div>
  );
}

export default withStyles(s)(Navigation);
