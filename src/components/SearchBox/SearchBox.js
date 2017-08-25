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
    this.state = { prevSearchTerm: '' };
  }

  shouldComponentUpdate() {
    return false;
  }

  onChange = (event) => {
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
  }

  render() {
    return (
      <div className={s.root}>
        <FaSearch className={s.icon} size={20} />
        <DebounceInput
          className="input"
          minLength={2}
          debounceTimeout={400}
          key={this.props.searchKey}
          value={this.props.searchKey}
          onChange={this.onChange}
          placeholder="Search..."
        />
      </div>
    );
  }
}

export default withStyles(s)(SearchBox);
