import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import Button from '../Button';

const userLinks =
  (<span>
    <Link className={s.link} to="/upload">Upload</Link>
    <a className={s.link} href="/logout">Log Out</a>
  </span>);

const guestLinks =
  (<Button href="/login" text="Sign up" type="primary" />);

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
