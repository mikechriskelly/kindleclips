import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import connectToStores from 'alt-utils/lib/connectToStores';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';
import Clip from '../../components/Clip';
import UserStore from '../../stores/UserStore';
import ClipStore from '../../stores/ClipStore';
import LoadSpinner from '../../components/LoadSpinner';

class Home extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    isLoggedIn: PropTypes.bool,
    wipeSearchTerm: PropTypes.bool,
    loading: PropTypes.bool,
    primaryClip: PropTypes.object,
    matchingClips: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string,
    })),
    similarClips: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string,
    })),
  };

  static getStores() {
    return [UserStore, ClipStore];
  }

  static getPropsFromStores() {
    return {
      ...UserStore.getState(),
      ...ClipStore.getState(),
    };
  }

  componentWillMount() {
    this.context.setTitle('Kindle Clips');
  }

  render() {
    let matchingMarkup = null;
    let primaryMarkup = null;
    let similarMarkup = null;

    // Matching Clips
    if (this.props.matchingClips.length > 0) {
      matchingMarkup = (
        <div className={s.primary}>
          <h2 className={s.title}>Search Results</h2>
          <ClipList clipList={this.props.matchingClips} />
        </div>
      );
    } else if (!this.props.loading && !this.props.primaryClip) {
      matchingMarkup = (
        <div className={s.primary}>
          <h2 className={s.title}>No Results Found</h2>
        </div>
      );
    }

    // Primary Clip
    if (this.props.primaryClip) {
      primaryMarkup = (
        <div className={s.primary}>
          <Clip
            title={this.props.primaryClip.title}
            author={this.props.primaryClip.author}
            text={this.props.primaryClip.text}
          />
        </div>
      );
    }

    // Similar Clips
    if (this.props.similarClips.length > 0) {
      similarMarkup = (
        <div className={s.primary}>
          <h2 className={s.title}>Similar Clips</h2>
          <ClipList clipList={this.props.similarClips} />
        </div>
      );
    }

    return (
      <div className={s.root}>
        <Header isLoggedIn={this.props.isLoggedIn} wipeSearchTerm={this.props.wipeSearchTerm} />
        {this.props.loading ? <LoadSpinner clear /> : null}
        <div className={s.container}>
          {matchingMarkup}
          {primaryMarkup}
          {similarMarkup}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(connectToStores(Home));
