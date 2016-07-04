import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Clip.css';

function Clip({ title, author, text, inList, className }) {
  const clipMarkup = (
    <div className={className}>
      <p
        className={s.text}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <span className={s.title}>{title}</span>
      <span className={s.author}>{author}</span>
    </div>
  );
  const listWrapper = inList && (<li className={s.listItem}>{clipMarkup}</li>);

  return inList ? listWrapper : clipMarkup;
}

Clip.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  inList: PropTypes.bool,
  index: PropTypes.number,
  className: PropTypes.string,
};

export default withStyles(s)(Clip);
