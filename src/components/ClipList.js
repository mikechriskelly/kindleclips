import React from 'react';
import PropTypes from 'prop-types';
import Clip from './ClipItem';

ClipList.propTypes = {
  clipList: PropTypes.arrayOf(
    PropTypes.shape({
      shortId: PropTypes.string,
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

function ClipList({ clipList, searchTerm }) {
  return (
    <ul>
      {clipList.map(clip =>
        <Clip
          shortId={clip.shortId}
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

export default ClipList;
