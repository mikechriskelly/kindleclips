import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import FaFacebook from 'react-icons/lib/fa/facebook';
import FaGoogle from 'react-icons/lib/fa/google';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Button.css'; // eslint-disable-line css-modules/no-unused-class
import Link from '../Link';

const types = {
  facebook: {
    href: '/login/facebook',
    text: 'Continue with Facebook',
    icon: <FaFacebook size={24} className={s.icon} />,
  },
  google: {
    href: '/login/google',
    text: 'Continue with Google',
    icon: <FaGoogle size={24} className={s.icon} />,
  },
};

function Button({ className, href, onClick, text, type }) {
  // Button or link?
  let button;
  if (type === 'plain' || (types[type] && types[type].href)) {
    button = (
      <a
        className={cx(s.button, className, s[type])}
        href={href || (types[type] && types[type].href)}
      >
        {types[type] && types[type].icon}
        {text || (types[type] && types[type].text)}
      </a>
    );
  } else if (href) {
    button = (
      <Link className={cx(s.button, className, s[type])} to={href}>
        {text}
      </Link>
    );
  } else {
    button = (
      <button className={cx(s.button, className, s[type])} onClick={onClick}>
        {text}
      </button>
    );
  }

  return button;
}

Button.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
  type: PropTypes.string,
};

export default withStyles(s)(Button);
