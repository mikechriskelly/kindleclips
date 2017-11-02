import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './../containers/Header';
import ClipList from './../components/ClipList';

class SearchPage extends React.Component {
  static propTypes = {
    searchTerm: PropTypes.string,
    matchingClips: PropTypes.arrayOf(
      PropTypes.shape({
        shortId: PropTypes.string,
        title: PropTypes.string,
        author: PropTypes.string,
        text: PropTypes.string,
      }),
    ),
  };

  static defaultProps = {
    searchTerm: null,
    matchingClips: [],
  };

  render() {
    return (
      <div>
        <Header searchTerm={this.props.searchTerm} />
        <div>
          {this.props.matchingClips.length > 0
            ? <ClipList
                clipList={this.props.matchingClips}
                searchTerm={this.props.searchTerm}
              />
            : <h2>No Results Found</h2>}
        </div>
      </div>
    );
  }
}

export default connect(state => state.clips)(SearchPage);
