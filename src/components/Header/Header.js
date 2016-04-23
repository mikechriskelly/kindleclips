import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';
import DebounceInput from 'react-debounce-input';

function Header() {
  return (
    <div className={s.root}>
      <div className="container">
        <div className="three columns">
          <Link className={s.links} to="/random">Random</Link>
          <Link className={s.links} to="/browse">Browse</Link>
        </div>
        <div className="nine columns">
          <div className={s.inputbar}>
            <img className={s.searchicon} src="search-icon.svg" alt="" />
            <DebounceInput
              className={s.searchfield}
              debounceTimeout={300}
              minLength={2}
              onChange={filterText => this.setState({ filterText })}
              placeholder="Search..."
            />
            <Navigation className={s.nav} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withStyles(s)(Header);
