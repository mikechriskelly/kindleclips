import React from 'react';
import PropTypes from 'prop-types';
import FaLevelUp from 'react-icons/lib/fa/level-up';
import styled from 'styled-components';
import Link from './Link';

ClipItem.propTypes = {
  shortId: PropTypes.string.isRequired,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string.isRequired,
  inList: PropTypes.bool,
  searchTerm: PropTypes.string,
};

ClipItem.defaultProps = {
  title: '',
  author: '',
  inList: false,
  searchTerm: null,
};

function ClipItem({ shortId, title, author, text, inList, searchTerm }) {
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
    <Container>
      <p>
        {markup.text}
      </p>
      <Metadata>
        <span>
          {markup.title}
        </span>
        <span>
          {` | ${markup.author}`}
        </span>
        {inList ? buttonSetPrimary : null}
      </Metadata>
    </Container>
  );

  const listWrapper =
    inList &&
    <StyledLi>
      {clipMarkup}
    </StyledLi>;

  return inList ? listWrapper : clipMarkup;
}

const Container = styled.div`
  margin: 0 auto;
  max-width: 700px;
`;

const HighlightedSpan = styled.span`
  background: rgba(255, 230, 0, 0.4);
  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: 3px;
  display: inline-block;
`;

const Metadata = styled.div`
  color: #666;
  font-size: 12px;
`;

const StyledLi = styled.li`list-style: none;`;

export default ClipItem;
