import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';
import SearchBox from '../SearchBox';

function Header({ isLoggedIn, clearSearch }) {
  return (
    <div className={s.container}>
      <header>
        <SearchBox clearSearch={clearSearch} />
        <Navigation className={s.nav} isLoggedIn={isLoggedIn} />
      </header>
    </div>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  clearSearch: PropTypes.bool,
};

export default withStyles(s)(Header);
