import React from 'react';
import styled from 'styled-components';

function NotFound() {
  return (
    <OuterContainer>
      <InnerContainer>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you were trying to view does not exist.</p>
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

export default NotFound;
