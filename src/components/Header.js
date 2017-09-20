import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import UserStore from '../../stores/UserStore';
import Navigation from './Navigation';
import SearchBox from '../containers/SearchBox';

Header.propTypes = {
  searchKey: PropTypes.string,
};

Header.defaultProps = {
  searchKey: '',
};

function Header({ searchKey }) {
  return (
    <Container>
      <StyledHeader>
        <SearchBox searchKey={searchKey} />
        {/* <Navigation className={s.secondary} isLoggedIn={UserStore.isLoggedIn()} /> */}
        <Navigation />
      </StyledHeader>
    </Container>
  );
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

export default Header;
