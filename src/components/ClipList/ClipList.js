import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ClipList.css';
import Clip from '../Clip';

function ClipList({ clipList, searchTerm }) {
  return (
    <ul className={s.clipList}>
      {clipList.map(clip =>
        <Clip
          id={clip.id}
          slug={clip.slug}
          key={clip.id}
          title={clip.title}
          author={clip.author}
          text={clip.text}
          searchTerm={searchTerm}
          inList
        />,
      )}
    </ul>
  );
}

ClipList.propTypes = {
  clipList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
  searchTerm: PropTypes.string,
};

ClipList.defaultProps = {
  clipList: [],
  searchTerm: '',
};

export default withStyles(s)(ClipList);
