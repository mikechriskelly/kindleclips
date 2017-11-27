import React from 'react';
import PropTypes from 'prop-types';
import FaLink from 'react-icons/lib/io/link';
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
      <StyledFaLink size={18} />
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

  // TODO: Remove these and do title/author search with real endpoints
  const searchTitle = title.replace(/[^a-zA-Z0-9-_]/g, ' ');
  const searchAuthor = author.replace(/[^a-zA-Z0-9-_]/g, ' ');

  const clipMarkup = (
    <Container>
      <Body>
        {markup.text}
      </Body>
      <Metadata>
        <Link to={`/title/${searchTitle}`}>
          {markup.title}
        </Link>
        {title.length > 0 ? <span> &#183; </span> : null}
        <Link to={`/author/${searchAuthor}`}>
          {markup.author}
        </Link>
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
  max-width: 650px;
  margin: 0 auto 60px auto;
  position: relative;
`;

const HighlightedSpan = styled.span`
  background: rgba(255, 230, 0, 0.4);
  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: 3px;
  display: inline-block;
`;
const Body = styled.p`margin: 0;`;

const Metadata = styled.div`
  font-size: 11px;
  padding-top: 5px;
  position: absolute;
  right: 0;
`;

const StyledFaLink = styled(FaLink)`
  margin-left: 5px;
`;

const StyledLi = styled.li`list-style: none;`;

export default ClipItem;
