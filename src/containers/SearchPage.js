import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from './../components/Layout';
import ClipList from './../components/ClipList';

class SearchPage extends React.Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    matchingClips: PropTypes.arrayOf(
      PropTypes.shape({
        shortId: PropTypes.string,
        title: PropTypes.string,
        author: PropTypes.string,
        text: PropTypes.string,
      }),
    ).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <Layout>
        <div>
          {this.props.isLoading ? <h2>Searching...</h2> : null}
          <ClipList
            clipList={this.props.matchingClips}
            searchTerm={this.props.isHighlighted ? this.props.searchTerm : null}
          />
        </div>
      </Layout>
    );
  }
}

export default connect(state => state.clips)(SearchPage);
