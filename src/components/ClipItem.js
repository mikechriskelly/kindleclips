import React from 'react';
import PropTypes from 'prop-types';
import FaRandom from 'react-icons/lib/fa/random';
import FaLevelUp from 'react-icons/lib/fa/level-up';
import styled from 'styled-components';
import Link from './Link';
import history from '../history';

ClipItem.propTypes = {
  shortId: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  inList: PropTypes.bool,
  index: PropTypes.number,
  searchTerm: PropTypes.string,
};

function ClipItem({ shortId, title, author, text, inList, searchTerm }) {
  const handleRandom = async () => {
    // TODO: Figure out where to update history since Redux actions don't return value here
    // const clip = await ClipActions.fetchPrimary(null, true);
    // const clip = {};
    history.push(`/c/${shortId}`);
  };

  const buttonRandom = (
    <button onClick={handleRandom}>
      <FaRandom size={22} />
    </button>
  );

  const buttonSetPrimary = (
    <Link to={`/c/${shortId}`}>
      <FaLevelUp size={22} />
    </Link>
  );

  const markup = { text, title, author };

  if (searchTerm) {
    const searchTermArray = searchTerm.match(/\S+/g) || [];
    const reSplit = new RegExp(`\\b(${searchTermArray.join('|')})`, 'ig');
    const reMatch = new RegExp(`^(${searchTermArray.join('|')})`, 'ig');

    Object.keys(markup).forEach(key => {
      markup[key] = markup[key].split(reSplit).filter(Boolean).map(
        x =>
          x.match(reMatch)
            ? <HighlightedSpan>
                {x}
              </HighlightedSpan>
            : x,
      );
    });
  }

  const clipMarkup = (
    <div>
      <p>
        {markup.text}
      </p>
      <span>
        {markup.title}
      </span>
      <span>
        {` | ${markup.author}`}
      </span>
      {inList ? buttonSetPrimary : buttonRandom}
    </div>
  );

  const listWrapper =
    inList &&
    <li>
      {clipMarkup}
    </li>;

  return inList ? listWrapper : clipMarkup;
}

const HighlightedSpan = styled.span`
  background: rgba(255, 230, 0, 0.4);
  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: 3px;
  display: inline-block;
`;

export default ClipItem;
