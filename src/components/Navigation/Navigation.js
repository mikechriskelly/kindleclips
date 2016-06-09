import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import UserStore from '../../stores/UserStore';

const userLinks =
  (<span>
    <a className={cx(s.link, s.highlight)} href="/logout">Log Out</a>
  </span>);

const guestLinks =
  (<span>
    <Link className={s.link} to="/login">Log in</Link>
    <span className={s.spacer}>or</span>
    <Link className={cx(s.link, s.highlight)} to="/login">Sign up</Link>
  </span>);

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = UserStore.getState();
    this.state.className = props.className;
  }

  render() {
    return (
      <div className={cx(s.root, this.state.className)} role="navigation">
        {this.state.token ? userLinks : guestLinks}
      </div>
    );
  }
}

Navigation.propTypes = {
  className: PropTypes.string,
};

export default withStyles(s)(Navigation);
