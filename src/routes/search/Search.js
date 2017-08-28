import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Search.css';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';

const Search = ({ searchTerm, results }, context) => {
  context.setTitle('Search results');

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
};

Search.contextTypes = { setTitle: PropTypes.func.isRequired };

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

export default withStyles(s)(Search);
