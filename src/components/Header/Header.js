import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import UserStore from '../../stores/UserStore';
import Navigation from '../Navigation';
import SearchBox from '../SearchBox';

const Header = ({ searchKey }) => (
  <div className={s.container}>
    <header>
      <SearchBox className={s.primary} searchKey={searchKey} />
      <Navigation className={s.secondary} isLoggedIn={UserStore.isLoggedIn()} />
    </header>
  </div>
);

Header.propTypes = {
  searchKey: PropTypes.string,
};

export default withStyles(s)(Header);
