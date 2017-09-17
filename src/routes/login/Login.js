import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import Button from '../../components/Button';

Login.propTypes = {
  title: PropTypes.string.isRequired,
};

function Login({ title }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h3>
          {title}
        </h3>
        <Button type="facebook" />
        <strong className={s.lineThrough}>OR</strong>
        <Button type="google" />
      </div>
    </div>
  );
}

export default withStyles(s)(Login);
