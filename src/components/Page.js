import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

Page.propTypes = {
  title: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
};

function Page({ title, html }) {
  return (
    <OuterContainer>
      <InnerContainer>
        <h1>
          {title}
        </h1>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </InnerContainer>
    </OuterContainer>
  );
}

const OuterContainer = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`;

const InnerContainer = styled.div`
  margin: 0 auto;
  padding: 0 0 40px;
  max-width: var(--max-content-width);
`;

export default Page;
