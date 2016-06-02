import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import Header from '../../components/Header';

const title = 'Kindle Clips';

function Home({ clips }, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <Header />
      <div className={s.container}>
        <h2 className={s.title}>Highlights</h2>
        <ul className={s.clipList}>
          {clips.map((item, index) => (
            <li key={index} className={s.clipItem}>
              <p
                className={s.clipText}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
              <span className={s.clipTitle}>{item.title}</span>
              <span className={s.clipAuthor}>{item.author}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Home.propTypes = {
  clips: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
  })).isRequired,
};
Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
