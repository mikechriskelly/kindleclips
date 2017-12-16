import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import SearchBox from '../components/SearchBox';
import Button from '../components/Button';
import Navigation from '../components/Navigation';
import { searchClips } from './../modules/clips';

class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
  };

  constructor({ dispatch }) {
    super();
    this.dispatch = dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.dispatch(searchClips(values.searchTerm));
  }

  render() {
    return (
      <Container>
        <StyledHeader>
          <Navigation isLoggedIn={this.props.isLoggedIn} />
          <SearchBox
            searchTerm={this.props.searchTerm}
            onSubmit={this.handleSubmit}
          />
          <Button href="/random" label="Random" />
        </StyledHeader>
      </Container>
    );
  }
}

const Container = styled.div`
  height: auto;
  padding: 10px 0;
  width: 100%;
`;

const StyledHeader = styled.header`
  height: auto;
  margin: 0 auto;
  min-height: 37px;
  padding: 0;
`;

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.isLoggedIn,
    searchTerm: state.clips.searchTerm,
  };
}

export default connect(mapStateToProps)(Header);
