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
    let title = null;
    let mainMarkup = null;
    let listMarkup = null;

    if (this.props.primaryClip) {
      mainMarkup = (
        <div className={s.container}>
          <Clip
            title={this.props.primaryClip.title}
            author={this.props.primaryClip.author}
            text={this.props.primaryClip.text}
          />
        </div>
      );
    } else if (!this.props.loading) {
      title = 'No Results Found';
      listMarkup = (
        <div className={s.container}>
          <h2 className={s.title}>{title}</h2>
        </div>
      );
    }

    if (this.props.matchingClips.length > 0) {
      title = 'Search Results';
      listMarkup = (
        <div className={s.container}>
          <h2 className={s.title}>{title}</h2>
          <ClipList clipList={this.props.matchingClips} />
        </div>
      );
    }

    if (this.props.similarClips.length > 0) {
      title = 'Similar Clips';
      listMarkup = (
        <div className={s.container}>
          <h2 className={s.title}>{title}</h2>
          <ClipList clipList={this.props.similarClips} />
        </div>
      );
    }

    return (
      <div className={s.root}>
        <Header isLoggedIn={this.props.isLoggedIn} />
        {this.props.loading ? <LoadSpinner clear /> : null}
        {mainMarkup}
        {listMarkup}
      </div>
    );
  }
}

export default withStyles(s)(connectToStores(Home));
