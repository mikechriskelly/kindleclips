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
        <div>
          <h2 className={s.title}>Search Results</h2>
          <ClipList clipList={this.props.matchingClips} />
        </div>
      );
    } else if (!this.props.loading && !this.props.primaryClip) {
      matchingMarkup = (
        <h2 className={s.title}>No Results Found</h2>
      );
    }

    // Primary Clip
    if (this.props.primaryClip) {
      primaryMarkup = (
        <Clip
          title={this.props.primaryClip.title}
          author={this.props.primaryClip.author}
          text={this.props.primaryClip.text}
        />
      );
    }

    // Similar Clips
    if (this.props.similarClips.length > 0) {
      similarMarkup = (
        <div>
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
          <div className={s.primary}>
            {matchingMarkup}
            {primaryMarkup}
            {similarMarkup}
          </div>
          <div className={s.secondary}>
            <h2><span className={s.brand}>Kindle Clips</span>. Your text, remixed.</h2>
            <p>A free service for Kindle owners to easily view the text clips they've highlighted.</p>
            <p>You can upload, search, and explore all your favorite quotes and excerpts stored on your Kindle device.</p>
            <p>Text analysis and topic modeling bring similar clips together, revealing serendipidous connections between passages.</p>
            <p>Explore demo highlights, or sign in to upload and browse highlights from your own Kindle.</p>
            <p className={s.author}>By Chris Castle and Mike Kelly</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(connectToStores(Home));
