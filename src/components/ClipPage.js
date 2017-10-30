import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Layout from './Layout';
import ClipList from './ClipList';
import ClipItem from './ClipItem';

ClipPage.propTypes = {
  shortId: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  similarClips: PropTypes.arrayOf(
    PropTypes.shape({
      shortId: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
};

ClipPage.defaultProps = {
  shortId: null,
  title: '',
  author: '',
  text: '',
  similarClips: [],
};

function ClipPage({ shortId, title, author, text, similarClips }) {
  return (
    <Layout>
      <Container>
        <ClipItem shortId={shortId} title={title} author={author} text={text} />
        <h2>Similar Clips</h2>
        {similarClips && <ClipList clipList={similarClips} />}
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  position: absolute;
  top: 2em;
  width: 100%;
`;

export default connect(state => state.clips.primaryClip)(ClipPage);