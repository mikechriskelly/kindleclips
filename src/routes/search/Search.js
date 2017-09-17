import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Search.css';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';

Search.propTypes = {
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

function Search({ searchTerm, results }) {
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

export default withStyles(s)(Search);
