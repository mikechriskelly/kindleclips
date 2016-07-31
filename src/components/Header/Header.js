import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';
import SearchBox from '../SearchBox';

function Header({ isLoggedIn, searchKey }) {
  return (
    <div className={s.container}>
      <header>
        <SearchBox className={s.primary} searchKey={searchKey} />
        <Navigation className={s.secondary} isLoggedIn={isLoggedIn} />
      </header>
    </div>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  searchKey: PropTypes.string,
};

export default withStyles(s)(Header);
