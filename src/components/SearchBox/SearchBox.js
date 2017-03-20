import React, { Component, PropTypes } from 'react';
import history from '../../core/history';
import DebounceInput from 'react-debounce-input';
import FaSearch from 'react-icons/lib/fa/search';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchBox.css';

class SearchBox extends Component {

  static propTypes = {
    searchKey: PropTypes.string,
  }

  constructor() {
    super();
    this.state = { lastValue: '' };
  }

  onChange = (event) => {
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      history.push('/');
    }

    if (searchTerm !== this.state.lastValue) {
      this.setState({ lastValue: searchTerm });
      history.push(`/s/${searchTerm}`);
    }
  }

  render() {
    return (
      <div className={s.root}>
        <FaSearch className={s.icon} size={20} />
        <DebounceInput
          className="input"
          minLength={2}
          debounceTimeout={200}
          key={this.props.searchKey}
          onChange={this.onChange}
          placeholder="Search..."
        />
      </div>
    );
  }
}

export default withStyles(s)(SearchBox);
