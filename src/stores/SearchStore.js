import alt from '../core/alt';
import SearchActions from '../actions/SearchActions';

class SearchStore {

  constructor() {
    this.bindListeners({
      handleSearchClips: SearchActions.SEARCH_CLIPS,
      handleUpdateClips: SearchActions.UPDATE_CLIPS,
      handleFailedClips: SearchActions.FAILED_CLIPS,
      handleClearClips: SearchActions.CLEAR_CLIPS,
    });

    this.state = {
      clips: [],
      errorMessage: null,
    };
  }

  handleSearchClips() {
    this.state.clips = [];
  }

  handleClearClips() {
    this.state.clips = [];
  }

  handleUpdateClips(clips) {
    this.state.clips = clips;
  }

  handleFailedClips(errorMessage) {
    this.state.errorMessage = errorMessage;
  }

}

export default alt.createStore(SearchStore, 'SearchStore');
