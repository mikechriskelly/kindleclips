import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Layout from './Layout';

Page.propTypes = {
  title: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
};

function Page({ title, html }) {
  return (
    <Layout>
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
    </Layout>
  );
}

const OuterContainer = styled.div`margin: 0;`;

const InnerContainer = styled.div`
  margin: 0 auto;
  padding: 0;
`;

export default Page;
