import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import Button from '../../components/Button';

class Home extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    randClipSlug: PropTypes.string,
  };

  componentWillMount() {
    this.context.setTitle('Kindle Clips');
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h2 className={s.brand}>Kindle Clips. Your text, remixed.</h2>
          <p>A free service for Kindle owners to easily view all their highlighted text.</p>
          <p>You can upload, search, and explore your favorite quotes and excerpts stored
          on your Kindle device.</p>
          <p>Explore demo highlights, or sign in to upload and browse highlights from your own
          Kindle.</p>
          <Button type="primary" href={`c/${this.props.randClipSlug}`} text="Try Demo" />
          <Button type="primary" href="/login" text="Sign Up" />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
