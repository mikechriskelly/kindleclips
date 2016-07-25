import React, { Component, PropTypes } from 'react';
import ClipActions from '../../actions/ClipActions';
import DebounceInput from 'react-debounce-input';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchBox.css';

class SearchBox extends Component {

  static propTypes = {
    wipeSearchTerm: PropTypes.bool,
  }

  constructor() {
    super();
    this.state = { value: '' };
  }

  componentWillReceiveProps() {
    if (this.props.wipeSearchTerm) {
      this.setState({ value: '' });
    }
  }

  onChange = (event) => {
    const searchTerm = event.target.value;
    if (searchTerm !== this.state.value) {
      this.setState({ value: searchTerm });
      ClipActions.fetchMatching(searchTerm);
    }
  }

  render() {
    return (
      <div className={s.root}>
        <svg
          className={s.icon}
          width="40"
          height="40"
          viewBox="0 0 100 125"
        >
          <path
            d={'M83.535,76.464L64.438,57.368C67.935,52.462,70,46.469,70,40c0-16.542-13.458-' +
            '30-30-30S10,23.458,10,40s13.458,30,30,30 c6.469,0,12.462-2.065,17.368-5.562l19' +
            '.097,19.097C77.44,84.512,78.721,85,80,85s2.56-0.488,3.535-1.464   C85.488,81.5' +
            '83,85.488,78.417,83.535,76.464z M40,60c-11.046,0-20-8.954-20-20s8.954-20,20-20' +
            's20,8.954,20,20S51.046,60,40,60z'}
          />
        </svg>
        <DebounceInput
          className="input"
          minLength={2}
          debounceTimeout={300}
          onChange={this.onChange}
          placeholder="Search..."
          value={this.state.value}
        />
      </div>
    );
  }
}

export default withStyles(s)(SearchBox);
