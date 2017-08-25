import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadSpinner.css';

function LoadSpinner({ clear }) {
  return (
    <div className={cx(s.loading, s.style, clear ? s.clear : null)}>
      <div className={s.wheel}>
      </div>
    </div>
  );
}

LoadSpinner.propTypes = { clear: PropTypes.bool };

export default withStyles(s)(LoadSpinner);
