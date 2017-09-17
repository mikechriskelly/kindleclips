import React from 'react';
import PropTypes from 'prop-types';
import FaRandom from 'react-icons/lib/fa/random';
import FaLevelUp from 'react-icons/lib/fa/level-up';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Clip.css';
// import ClipActions from '../../actions/ClipActions';
import Link from '../Link';
import history from '../../history';

Clip.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  inList: PropTypes.bool,
  index: PropTypes.number,
  searchTerm: PropTypes.string,
};

function Clip({ title, author, text, inList, searchTerm, slug }) {
  const handleRandom = async () => {
    // const clip = await ClipActions.fetchPrimary(null, true);
    const clip = {};
    history.push(`/c/${clip.slug}`);
  };

  const buttonRandom = (
    <button onClick={handleRandom} className={s.action}>
      <FaRandom size={22} />
    </button>
  );

  const buttonSetPrimary = (
    <Link className={s.action} to={`/c/${slug}`}>
      <FaLevelUp size={22} />
    </Link>
  );

  const markup = { text, title, author };

  if (searchTerm) {
    const searchTermArray = searchTerm.match(/\S+/g) || [];
    const reSplit = new RegExp(`\\b(${searchTermArray.join('|')})`, 'ig');
    const reMatch = new RegExp(`^(${searchTermArray.join('|')})`, 'ig');

    Object.keys(markup).forEach(key => {
      markup[key] = markup[key].split(reSplit).filter(Boolean).map(
        x =>
          x.match(reMatch)
            ? <span className={s.highlight}>
                {x}
              </span>
            : x,
      );
    });
  }

  const clipMarkup = (
    <div className={inList ? s.regular : s.primary}>
      <p className={s.text}>
        {markup.text}
      </p>
      <span className={s.title}>
        {markup.title}
      </span>
      <span className={s.author}>
        {markup.author}
      </span>
      {inList ? buttonSetPrimary : buttonRandom}
    </div>
  );

  const listWrapper =
    inList &&
    <li className={s.listItem}>
      {clipMarkup}
    </li>;

  return inList ? listWrapper : clipMarkup;
}

export default withStyles(s)(Clip);
