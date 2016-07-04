import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadSpinner.css';

function LoadSpinner({ className }) {
  return (
    <div className={cx(s.loading, s.style, className)}>
      <div className={s.wheel}>
      </div>
    </div>
  );
}

LoadSpinner.propTypes = { className: PropTypes.string };

export default withStyles(s)(LoadSpinner);
