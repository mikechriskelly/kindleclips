import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import Button from '../../components/Button';

const Login = props =>
  <div className={s.root}>
    <div className={s.container}>
      <h3>
        {props.title}
      </h3>
      <Button type="facebook" />
      <strong className={s.lineThrough}>OR</strong>
      <Button type="google" />
    </div>
  </div>;

Login.propTypes = {
  title: PropTypes.string.isRequired,
};

export default withStyles(s)(Login);
