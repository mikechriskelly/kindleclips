import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
// import UserStore from '../../stores/UserStore';
import Navigation from '../Navigation';
import SearchBox from '../SearchBox';

Header.propTypes = {
  searchKey: PropTypes.string,
};

Header.defaultProps = {
  searchKey: '',
};

function Header({ searchKey }) {
  return (
    <div className={s.container}>
      <header>
        <SearchBox className={s.primary} searchKey={searchKey} />
        {/* <Navigation className={s.secondary} isLoggedIn={UserStore.isLoggedIn()} /> */}
        <Navigation className={s.secondary} />
      </header>
    </div>
  );
}

export default withStyles(s)(Header);
