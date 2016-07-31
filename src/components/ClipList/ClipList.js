import React, { PropTypes } from 'react';
import Clip from '../Clip';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ClipList.css';

function ClipList({ clipList, searchTerm }) {
  return (
    <ul className={s.clipList}>
      {clipList.map((clip) => (
        <Clip
          id={clip.id}
          key={clip.id}
          title={clip.title}
          author={clip.author}
          text={clip.text}
          searchTerm={searchTerm}
          inList
        />
      ))}
    </ul>
  );
}

ClipList.propTypes = {
  clipList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
  })),
  searchTerm: PropTypes.string,
};

export default withStyles(s)(ClipList);
