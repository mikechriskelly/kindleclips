import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Clipping.css';
import connectToStores from 'alt-utils/lib/connectToStores';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';
import Clip from '../../components/Clip';
import UserStore from '../../stores/UserStore';
import ClipStore from '../../stores/ClipStore';

class Clipping extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    id: PropTypes.string,
    primaryClip: PropTypes.object,
    similarClips: PropTypes.array,
    errorMessage: PropTypes.string,
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
    let errorMarkup = null;
    let primaryMarkup = null;
    let similarMarkup = null;

    // Error Message
    if (this.props.errorMessage) {
      errorMarkup = (
        <h4 className={s.title}>{this.props.errorMessage}</h4>
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
      // with similar Clips
      if (this.props.similarClips.length > 0) {
        similarMarkup = (
          <div>
            <h2 className={s.title}>Similar Clips</h2>
            <ClipList clipList={this.props.similarClips} />
          </div>
        );
      }
    }

    return (
      <div className={s.root}>
        <Header isLoggedIn={this.props.isLoggedIn} searchKey={this.props.searchKey} />
        <div className={s.container}>
          <div className={s.primary}>
            {errorMarkup}
            {primaryMarkup}
            {similarMarkup}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(connectToStores(Clipping));

