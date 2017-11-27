import React from 'react';
import PropTypes from 'prop-types';
import ClipItem from './ClipItem';

ClipList.propTypes = {
  clipList: PropTypes.arrayOf(
    PropTypes.shape({
      shortId: PropTypes.string.isRequired,
      title: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
  searchTerm: PropTypes.string,
};

ClipList.defaultProps = {
  searchTerm: null,
};

function ClipList({ clipList, searchTerm }) {
  return [
    <h2>
      {searchTerm ? 'Search Results' : 'Similar Clips'}
    </h2>,
    <ul>
      {clipList.map(clip =>
        <ClipItem
          shortId={clip.shortId}
          key={clip.shortId}
          title={clip.title}
          author={clip.author}
          text={clip.text}
          searchTerm={searchTerm}
          inList
        />,
      )}
    </ul>,
  ];
}

export default ClipList;
