import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

NotFound.propTypes = {
  title: PropTypes.string.isRequired,
};

function NotFound({ title }) {
  return (
    <OuterContainer>
      <InnerContainer>
        <h1>
          {title}
        </h1>
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
