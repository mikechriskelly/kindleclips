import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import connectToStores from 'alt-utils/lib/connectToStores';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';
import UserStore from '../../stores/UserStore';
import SearchStore from '../../stores/SearchStore';
import SearchActions from '../../actions/SearchActions';

class Home extends Component {
  static getStores() {
    return [UserStore, SearchStore];
  }

  static getPropsFromStores() {
    return {
      ...UserStore.getState(),
      ...SearchStore.getState(),
    };
  }

  constructor(props) {
    super(props);
    SearchActions.fetchClips();
  }

  render() {
    return (
      <div className={s.root}>
        <Header isLoggedIn={this.props.isLoggedIn} />
        <div className={s.container}>
          <h2 className={s.title}>Highlights</h2>
          <ClipList clips={this.props.clips} />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  isLoggedIn: PropTypes.bool,
  clips: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
  })),
};

export default withStyles(s)(connectToStores(Home));
