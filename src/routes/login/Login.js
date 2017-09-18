import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import LoginButton from '../../components/LoginButton';

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
        <LoginButton type="facebook" />
        <strong className={s.lineThrough}>OR</strong>
        <LoginButton type="google" />
      </div>
    </div>
  );
}

export default withStyles(s)(Login);
