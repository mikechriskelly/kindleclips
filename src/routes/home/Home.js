import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.scss';

const title = 'Kindle Clips';

function Home({ clippings }, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>Kindle Clips</h1>
        <ul className={s.news}>
          {clippings.map((item, index) => (
            <li key={index} className={s.newsItem}>
              <a href="#" className={s.newsTitle}>{item.title}</a> {item.author}
              <span
                className={s.newsDesc}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Home.propTypes = {
  clippings: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    text: PropTypes.string,
  })).isRequired,
};
Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
