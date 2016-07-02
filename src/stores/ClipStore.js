import alt from '../core/alt';
import ClipActions from '../actions/ClipActions';

class ClipStore {

  constructor() {
    this.bindListeners({
      handleSearch: ClipActions.SEARCH,
      handleUpdate: ClipActions.UPDATE,
      handleFail: ClipActions.FAIL,
      handleClear: ClipActions.CLEAR,
    });

    this.state = {
      clips: [],
      errorMessage: null,
    };
  }

  handleSearch() {
    this.state.clips = [];
  }

  handleClear() {
    this.state.clips = [];
  }

  handleUpdate(clips) {
    this.state.clips = clips;
  }

  handleFail(errorMessage) {
    this.state.errorMessage = errorMessage;
  }

}

export default alt.createStore(ClipStore, 'ClipStore');
