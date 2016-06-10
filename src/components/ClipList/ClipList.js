import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ClipList.css';
import SearchStore from '../../stores/SearchStore';

class ClipList extends Component {
  constructor(props) {
    super(props);
    this.state = SearchStore.getState();
  }

  render() {
    return (
      <div className={cx(s.root, this.state.className)} role="navigation">
        {this.state.clips.length}
      </div>
    );
  }
}

ClipList.propTypes = {
  className: PropTypes.string,
  clips: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
  })).isRequired,
};

export default withStyles(s)(ClipList);
