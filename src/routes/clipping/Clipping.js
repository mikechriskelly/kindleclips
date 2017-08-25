import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Clipping.css';
import Header from '../../components/Header';
import ClipList from '../../components/ClipList';
import Clip from '../../components/Clip';

const Clipping = (props, context) => {
  context.setTitle(`${props.title} - ${props.author}`);

  return (<div className={s.root}>
    <Header />
    <div className={s.container}>
      <div className={s.primary}>
        <Clip
          title={props.title}
          author={props.author}
          text={props.text}
        />
      </div>
      <h2 className={s.title}>Similar Clips</h2>
      <ClipList clipList={props.similarClips} />
    </div>
  </div>);
};

Clipping.contextTypes = { setTitle: PropTypes.func.isRequired };

Clipping.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  similarClips: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
  })),
};

export default withStyles(s)(Clipping);
