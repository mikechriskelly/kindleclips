import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Navigation from '../Navigation';

function Header() {
  return (
    <div className={s.root}>
      <div className={s.inputbar}>
        <input
          className={s.searchfield}
          onChange={filterText => this.setState({ filterText })}
          placeholder="Search..."
        />
      </div>
      <Navigation className={s.nav} />
    </div>
  );
}

export default withStyles(s)(Header);
