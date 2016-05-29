import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';

function Header() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.search}>
          <input
            onChange={filterText => this.setState({ filterText })}
            placeholder="Search..."
          />
        </div>
        <Navigation className={s.nav} />
      </div>
    </div>
  );
}

export default withStyles(s)(Header);
