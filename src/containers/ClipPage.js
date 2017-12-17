import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Layout from './../components/Layout';
import ClipList from './../components/ClipList';
import ClipItem from './../components/ClipItem';

class ClipPage extends React.Component {
  static propTypes = {
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

  static defaultProps = {
    shortId: '',
    title: '',
    author: '',
    text: '',
    similarClips: [],
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
          <ClipList clipList={this.props.similarClips} />
        </Container>
      </Layout>
    );
  }
}

const Container = styled.div`
  max-width: 750px;
  width: 100%;
`;

export default connect(state => state.clips.primaryClip)(ClipPage);
