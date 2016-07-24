import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';
import SearchBox from '../SearchBox';

function Header({ isLoggedIn, wipeSearchTerm }) {
  return (
    <div className={s.container}>
      <header>
        <SearchBox wipeSearchTerm={wipeSearchTerm} />
        <Navigation className={s.nav} isLoggedIn={isLoggedIn} />
      </header>
    </div>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  wipeSearchTerm: PropTypes.bool,
};

export default withStyles(s)(Header);
