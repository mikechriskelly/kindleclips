import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Content.css';
import Button from '../../components/Button';

const Home = ({ id }, context) => {
  const title = 'Kindle Clips';
  context.setTitle(title);

  return (
    <div className={s.root}>
      <div className={s.container}>
        <h2 className={s.brand}>Kindle Clips. Your text, remixed.</h2>
        <p>
          A free service for Kindle owners to easily view all their highlighted
          text.
        </p>
        <p>
          You can upload, search, and explore your favorite quotes and excerpts
          stored on your Kindle device.
        </p>
        <p>
          Explore demo highlights, or sign in to upload and browse highlights
          from your own Kindle.
        </p>
        <Button type="primary" href={`/c/${id}`} text="Try Demo" />
        <Button type="primary" href="/login" text="Sign Up" />
      </div>
    </div>
  );
};

Home.contextTypes = { setTitle: PropTypes.func.isRequired };
Home.propTypes = {
  id: PropTypes.string,
};

export default withStyles(s)(Home);
