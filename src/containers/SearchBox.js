import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import DebounceInput from 'react-debounce-input';
import FaSearch from 'react-icons/lib/fa/search';
import history from '../history';

class SearchBox extends React.Component {
  static propTypes = {
    searchKey: PropTypes.string,
  };

  static defaultProps = {
    searchKey: '',
  };

  constructor() {
    super();
    this.state = { prevSearchTerm: '' };
  }

  shouldComponentUpdate() {
    return false;
  }

  onChange = event => {
    const currSearchTerm = event.target.value;
    const prevSearchTerm = this.state.lastValue;

    if (currSearchTerm && currSearchTerm !== prevSearchTerm) {
      this.setState({ prevSearchTerm: currSearchTerm });
      if (currSearchTerm.includes(prevSearchTerm)) {
        history.replace(`/s/${currSearchTerm}`);
      } else {
        history.push(`/s/${currSearchTerm}`);
      }
    }
  };

  render() {
    return (
      <Container>
        <SearchIcon />
        <StyledDebounced
          minLength={2}
          debounceTimeout={400}
          key={this.props.searchKey}
          value={this.props.searchKey}
          onChange={this.onChange}
          placeholder="Search..."
        />
      </Container>
    );
  }
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
