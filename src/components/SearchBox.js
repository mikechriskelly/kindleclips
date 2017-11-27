import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Field, reduxForm } from 'redux-form';
import FaSearch from 'react-icons/lib/fa/search';

SearchBox.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

function SearchBox({ searchTerm, handleSubmit }) {
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <SearchIcon />
        <SearchField
          aria-label="Search clips"
          component="input"
          name="searchTerm"
          placeholder="Search..."
          type="search"
          value={searchTerm}
        />
      </form>
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

const SearchField = styled(Field)`
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

export default reduxForm({ form: 'search' })(SearchBox);
