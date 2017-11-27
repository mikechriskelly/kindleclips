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
  };

  render() {
    return (
      <Layout>
        <div>
          {this.props.matchingClips.length > 0
            ? <ClipList
                clipList={this.props.matchingClips}
                searchTerm={this.props.searchTerm}
              />
            : <h2>No Results Found</h2>}
        </div>
      </Layout>
    );
  }
}

export default connect(state => state.clips)(SearchPage);
