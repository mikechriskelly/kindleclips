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
          defaultValue={searchTerm}
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
  background-color: #efefef;
  margin: 10px 0;
  max-height: 37px;
  vertical-align: middle;
  width: 100%;
`;

const baseIcon = css`
  color: #222;
  left: 4px;
  position: relative;
  top: -2px;
  width: 25px;
`;

const SearchIcon = styled(FaSearch)`${baseIcon}`;

const SearchField = styled(Field)`
  background-color: inherit;
  border: none;
  border-radius: 0;
  color: #222;
  font-size: 16px;
  outline: none;
  padding: 6px;
  :placeholder {
    color: #ccc;
  }
  width: calc(100% - 30px);
`;

export default reduxForm({ form: 'search' })(SearchBox);
