import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

const userLinks =
  (<span>
    <a className={s.link} href="/upload">Upload</a>
    <a className={s.link} href="/logout">Log Out</a>
  </span>);

const guestLinks =
  (<span>
    <Link className={s.link} to="/login">Log in</Link>
    <Link className={cx(s.link, s.highlight)} to="/login">Sign up</Link>
  </span>);

function Navigation({ className, isLoggedIn }) {
  return (
    <div className={cx(s.root, className)} role="navigation">
      {isLoggedIn ? userLinks : guestLinks}
    </div>
  );
}

Navigation.propTypes = {
  className: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

export default withStyles(s)(Navigation);
