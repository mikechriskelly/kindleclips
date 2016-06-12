import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ClipList.css';

function ClipList({ clips }) {
  return (
    <ul className={s.clipList}>
      {clips.map((item, index) => (
        <li key={index} className={s.clipItem}>
          <p
            className={s.clipText}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
          <span className={s.clipTitle}>{item.title}</span>
          <span className={s.clipAuthor}>{item.author}</span>
        </li>
      ))}
    </ul>
  );
}

ClipList.propTypes = {
  clips: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
  })),
};

export default withStyles(s)(ClipList);
