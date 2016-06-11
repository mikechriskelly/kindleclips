import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Navigation from '../Navigation';

function Header({ isLoggedIn }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <Navigation className={s.nav} isLoggedIn={isLoggedIn} />
        <div className={s.search}>
          <svg
            className={s.icon}
            width="40"
            height="40"
            viewBox="0 0 100 125"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={'M83.535,76.464L64.438,57.368C67.935,52.462,70,46.469,70,40c0-16.542-13.458-' +
              '30-30-30S10,23.458,10,40s13.458,30,30,30 c6.469,0,12.462-2.065,17.368-5.562l19' +
              '.097,19.097C77.44,84.512,78.721,85,80,85s2.56-0.488,3.535-1.464   C85.488,81.5' +
              '83,85.488,78.417,83.535,76.464z M40,60c-11.046,0-20-8.954-20-20s8.954-20,20-20' +
              's20,8.954,20,20S51.046,60,40,60z'}
            />
          </svg>
          <input
            onChange={filterText => this.setState({ filterText })}
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
};

export default withStyles(s)(Header);
