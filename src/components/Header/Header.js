import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';
import SearchBox from '../SearchBox';

function Header({ isLoggedIn, wipeSearch }) {
  return (
    <div className={s.container}>
      <header>
        <SearchBox className={s.primary} wipeSearch={wipeSearch} />
        <Navigation className={s.secondary} isLoggedIn={isLoggedIn} />
      </header>
    </div>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  wipeSearch: PropTypes.string,
};

export default withStyles(s)(Header);
