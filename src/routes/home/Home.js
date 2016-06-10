import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';

const title = 'Kindle Clips';

function Home({ clips }, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <Header />
      <div className={s.container}>
        <h2 className={s.title}>Highlights</h2>
        <ClipList />
      </div>
    </div>
  );
}

Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
