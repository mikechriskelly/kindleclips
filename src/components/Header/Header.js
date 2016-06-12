import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';
import SearchBox from '../SearchBox';

function Header({ isLoggedIn }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <Navigation className={s.nav} isLoggedIn={isLoggedIn} />
        <SearchBox />
      </div>
    </div>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default withStyles(s)(Header);
