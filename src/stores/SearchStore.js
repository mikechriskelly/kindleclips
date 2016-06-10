import alt from '../core/alt';
import SearchActions from '../actions/SearchActions';

class SearchStore {

  constructor() {
    this.bindListeners({
      handleFetchClips: SearchActions.FETCH_CLIPS,
      handleUpdateClips: SearchActions.UPDATE_CLIPS,
      handleFailedClips: SearchActions.FAILED_CLIPS,
    });

    this.state = {
      clips: [],
      errorMessage: null,
    };
  }

  handleFetchClips() {
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
