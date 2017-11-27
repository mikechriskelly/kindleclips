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
  if (clipList.length === 0) {
    return (
      <h2>
        {searchTerm ? 'No Results' : null}
      </h2>
    );
  }

  if (clipList.length > 0) {
    return (
      <div>
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
        </ul>
      </div>
    );
  }
}

export default ClipList;
