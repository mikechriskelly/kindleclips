import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Clip.css';
import FaRandom from 'react-icons/lib/fa/random';
import FaLevelUp from 'react-icons/lib/fa/level-up';
import Link from '../Link';
import ClipActions from '../../actions/ClipActions';

function Clip({ title, author, text, id, inList }) {
  const buttonRandom = (
    <Link to="/random" className={s.action}>
      <FaRandom size={22} />
    </Link>
  );

  const handleClick = () => ClipActions.updateSingle(id);

  const buttonLink = (
    <div className={s.action} onClick={handleClick}>
      <FaLevelUp size={22} />
    </div>
  );

  const clipMarkup = (
    <div className={inList ? s.regular : s.primary}>
      <p
        className={s.text}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <span className={s.title}>{title}</span>
      <span className={s.author}>{author}</span>
      {inList ? buttonLink : buttonRandom}
    </div>
  );
  const listWrapper = inList && (<li className={s.listItem}>{clipMarkup}</li>);

  return inList ? listWrapper : clipMarkup;
}

Clip.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  inList: PropTypes.bool,
  index: PropTypes.number,
};

export default withStyles(s)(Clip);
