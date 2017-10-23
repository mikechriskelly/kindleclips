import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Layout from './Layout';
import ClipList from './ClipList';
import ClipItem from './ClipItem';

ClipPage.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  similarClips: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
      title: PropTypes.string,
      author: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
};

ClipPage.defaultProps = {
  id: 'NONE',
  slug: 'notfound',
  title: '',
  author: '',
  text: '',
  similarClips: [],
};

function ClipPage({ id, slug, title, author, text, similarClips }) {
  return (
    <Layout>
      <Container>
        <ClipItem
          id={id}
          slug={slug}
          title={title}
          author={author}
          text={text}
        />
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
