import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import Button from '../../components/Button';

const title = 'Log in to Kindle Clips';

function Login(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h3>{title}</h3>
        <Button type="facebook" />
        <strong className={s.lineThrough}>OR</strong>
        <Button type="google" />
      </div>
    </div>
  );
}

Login.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Login);
