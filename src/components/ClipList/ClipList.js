import React, { PropTypes } from 'react';
import Clip from '../Clip';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ClipList.css';

function ClipList({ clipList }) {
  return (
    <ul className={s.clipList}>
      {clipList.map((clip) => (
        <Clip
          key={clip.id}
          title={clip.title}
          author={clip.author}
          text={clip.text}
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
};

export default withStyles(s)(ClipList);
