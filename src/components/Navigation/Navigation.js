import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Button from '../Button';

const userLinks = (
  <div>
    <Button className={s.link} href="/upload" text="Upload" />
    <Button className={s.link} href="/logout" text="Log Out" type="plain" />
  </div>
);

const guestLinks = (
  <Button href="/login" text="Sign in / Sign up" type="primary" />
);

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

Navigation.defaultProps = {
  className: '',
  isLoggedIn: false,
};

export default withStyles(s)(Navigation);
