import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Layout from './../components/Layout';
import ClipList from './../components/ClipList';
import ClipItem from './../components/ClipItem';

class ClipPage extends React.Component {
  static propTypes = {
    shortId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    similarClips: PropTypes.arrayOf(
      PropTypes.shape({
        shortId: PropTypes.string,
        title: PropTypes.string,
        author: PropTypes.string,
        text: PropTypes.string,
      }),
    ).isRequired,
  };

  render() {
    return (
      <Layout>
        <Container>
          <ClipItem
            shortId={this.props.shortId}
            title={this.props.title}
            author={this.props.author}
            text={this.props.text}
          />
          {this.props.similarClips.length > 0 &&
            <ClipList clips={this.props.similarClips} />}
        </Container>
      </Layout>
    );
  }
}

const Container = styled.div`
  position: absolute;
  top: 2em;
  width: 100%;
`;

export default connect(state => state.clips.primaryClip)(ClipPage);
