import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Clipping.css';
import ClipList from '../../components/ClipList';
import Clip from '../../components/Clip';

const Clipping = props =>
  <div>
    <div className={s.primary}>
      <Clip
        id={props.id}
        slug={props.slug}
        title={props.title}
        author={props.author}
        text={props.text}
      />
    </div>
    <h2>Similar Clips</h2>
    <ClipList clipList={props.similarClips} />
  </div>;

Clipping.contextTypes = { setTitle: PropTypes.func.isRequired };

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

export default withStyles(s)(Clipping);
