import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import ClipList from './ClipList';

SearchPage.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string,
    }),
  ).isRequired,
};

function SearchPage({ searchTerm, results }) {
  return (
    <div>
      <Header searchKey={searchTerm} />
      <div>
        {results.length > 0
          ? <div>
              <h2>Search Results</h2>
              <ClipList clipList={results} searchTerm={results.searchTerm} />
            </div>
          : <h2>No Results Found</h2>}
      </div>
    </div>
  );
}

export default SearchPage;
