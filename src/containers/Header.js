import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Navigation from '../components/Navigation';
import SearchBox from '../components/SearchBox';
import { searchClips } from './../modules/clips';

class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    searchTerm: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    isLoggedIn: false,
    searchTerm: '',
    onChange: null,
  };

  render() {
    return (
      <Container>
        <StyledHeader>
          <Navigation isLoggedIn={this.props.isLoggedIn} />
          <SearchBox
            searchKey={this.props.searchTerm}
            onChange={this.props.onChange}
          />
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
    searchTerm: state.clips.searchTerm,
    isLoggedIn: state.user.isLoggedIn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: event => {
      const newSearchTerm = event.target.value;
      dispatch(searchClips(newSearchTerm));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
