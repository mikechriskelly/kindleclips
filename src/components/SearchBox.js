import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import DebounceInput from 'react-debounce-input';
import FaSearch from 'react-icons/lib/fa/search';

SearchBox.propTypes = {
  searchTerm: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

SearchBox.defaultProps = {
  searchTerm: '',
};

function SearchBox({ searchTerm, onChange }) {
  return (
    <Container>
      <SearchIcon />
      <StyledDebounced
        minLength={2}
        debounceTimeout={400}
        key={searchTerm}
        value={searchTerm}
        onChange={onChange}
        placeholder="Search..."
      />
    </Container>
  );
}

const Container = styled.div`
  background-color: '#666';
  border-radius: 3px;
  float: left;
  margin: 0 10px;
  max-height: 37px;
  padding-left: 0px;
  position: relative;
  vertical-align: middle;
  width: 50%;
`;

const baseIcon = css`
  color: #fff;
  margin: -5px 4px 0 8px;
  size: 20;
`;

const SearchIcon = styled(FaSearch)`${baseIcon}`;

const StyledDebounced = styled(DebounceInput)`
  background-color: inherit;
  border: none;
  border-radius: 0;
  color: #fff;
  font-size: 18px;
  margin-top: 5px;
  outline: none;
  padding: 2px;
  width: calc(100% - 40px);
  :placeholder {
    color: #fff;
  }
`;

export default SearchBox;
