import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadSpinner.css';

LoadSpinner.propTypes = { clear: PropTypes.bool };
LoadSpinner.defaultProps = { clear: false };

function LoadSpinner({ clear }) {
  return (
    <div className={cx(s.loading, s.style, clear ? s.clear : null)}>
      <div className={s.wheel} />
    </div>
  );
}

export default withStyles(s)(LoadSpinner);
