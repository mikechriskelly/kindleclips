import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Clipping.css';
import ClipList from '../../components/ClipList';
import Clip from '../../components/Clip';

Clipping.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  similarClips: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
};

Clipping.defaultProps = {
  id: 'NONE',
  slug: 'notfound',
  title: '',
  author: '',
  text: '',
  similarClips: [],
};

function Clipping({ id, slug, title, author, text, similarClips }) {
  return (
    <div className={s.root}>
      <div className={s.primary}>
        <Clip id={id} slug={slug} title={title} author={author} text={text} />
      </div>
      <h2>Similar Clips</h2>
      {similarClips && <ClipList clipList={similarClips} />}
    </div>
  );
}

export default withStyles(s)(Clipping);
