import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import connectToStores from 'alt-utils/lib/connectToStores';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';
import Clip from '../../components/Clip';
import UserStore from '../../stores/UserStore';
import ClipStore from '../../stores/ClipStore';

class Home extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    isLoggedIn: PropTypes.bool,
    primaryClip: PropTypes.object,
    matchingClips: PropTypes.arrayOf(PropTypes.shape({
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
    let title = 'Search Results';
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
      title = 'Similar Clips';
    }

    if (this.props.matchingClips.length > 0) {
      listMarkup = (
        <div className={s.container}>
          <h2 className={s.title}>{title}</h2>
          <ClipList clipList={this.props.matchingClips} />
        </div>
      );
    }

    return (
      <div className={s.root}>
        <Header isLoggedIn={this.props.isLoggedIn} />
        {mainMarkup}
        {listMarkup}
      </div>
    );
  }
}

export default withStyles(s)(connectToStores(Home));
