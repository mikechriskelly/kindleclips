import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Button.css';
import Link from '../Link';

function Button({ className }) {
  return (
    <div className={cx(s.root, className)}>
    </div>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};

export default withStyles(s)(Button);
