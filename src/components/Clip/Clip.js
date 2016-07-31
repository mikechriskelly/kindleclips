import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Clip.css';
import FaRandom from 'react-icons/lib/fa/random';
import FaLevelUp from 'react-icons/lib/fa/level-up';
import ClipActions from '../../actions/ClipActions';

function Clip({ title, author, text, id, inList, searchTerm }) {
  const handleSetPrimary = () => ClipActions.changePrimary(id);
  const handleRandom = () => ClipActions.changePrimary();

  const buttonRandom = (
    <div onClick={handleRandom} className={s.action}>
      <FaRandom size={22} />
    </div>
  );

  const buttonSetPrimary = (
    <div className={s.action} onClick={handleSetPrimary}>
      <FaLevelUp size={22} />
    </div>
  );

  const markup = { text, title, author };

  if (searchTerm) {
    const searchTermArray = searchTerm.match(/\S+/g) || [];
    const reSplit = new RegExp(`\\b(${searchTermArray.join('|')})`, 'ig');
    const reMatch = new RegExp(`^(${searchTermArray.join('|')})`, 'ig');

    Object.keys(markup).forEach(key => {
      markup[key] = markup[key]
        .split(reSplit)
        .filter(Boolean)
        .map(x => x.match(reMatch) ? <span className={s.highlight}>{x}</span> : x);
    });
  }

  const clipMarkup = (
    <div className={inList ? s.regular : s.primary}>
      <p className={s.text}>{markup.text}</p>
      <span className={s.title}>{markup.title}</span>
      <span className={s.author}>{markup.author}</span>
      {inList ? buttonSetPrimary : buttonRandom}
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
  searchTerm: PropTypes.string,
};

export default withStyles(s)(Clip);
