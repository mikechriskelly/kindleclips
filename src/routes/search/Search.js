import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Search.css';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';

const Search = ({ results }, context) => {
  context.setTitle('Search results');

  return (<div className={s.root}>
    <Header />
    <div className={s.container}>
      {results.length > 0 ? <div>
        <h2 className={s.title}>Search Results</h2>
        <ClipList clipList={results} searchTerm={results.searchTerm} />
      </div> : <h2 className={s.title}>No Results Found</h2>}
    </div>
  </div>);
};

Search.contextTypes = { setTitle: PropTypes.func.isRequired };

Search.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
  })),
};

export default withStyles(s)(Search);
