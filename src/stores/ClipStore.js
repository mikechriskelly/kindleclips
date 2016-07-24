import alt from '../core/alt';
import ClipActions from '../actions/ClipActions';

class ClipStore {

  constructor() {
    this.bindListeners({
      handleSearch: ClipActions.SEARCH,
      handleUpdateAll: ClipActions.UPDATE_ALL,
      handleUpdateMatching: ClipActions.UPDATE_MATCHING,
      handleUpdateSimilar: ClipActions.UPDATE_SIMILAR,
      handleUpdateSingle: ClipActions.UPDATE_SINGLE,
      handleFail: ClipActions.UPDATE_FAIL,
      handleRandom: ClipActions.RANDOM,
      handleClearSearch: ClipActions.CLEAR_SEARCH,
    });

    this.state = {
      searchTerm: '',
      allClips: [],
      matchingClips: [],
      similarClips: [],
      primaryClip: null,
      errorMessage: null,
      loading: true,
      clearSearch: false,
    };
  }

  findIndex(array, attr, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  handleSearch(searchTerm) {
    this.state.clearSearch = false;
    this.state.searchTerm = searchTerm;
    this.state.matchingClips = [];
    this.state.primaryClip = null;
    this.state.similarClips = null;
    this.state.errorMessage = null;
    this.state.loading = true;
  }

  handleComplete() {
    this.state.loading = false;
  }

  handleUpdateAll(clips) {
    this.state.allClips = clips;
    this.handleComplete();
  }

  handleUpdateMatching(clips) {
    this.state.primaryClip = null;
    this.state.similarClips = [];
    this.state.matchingClips = clips;
    this.handleComplete();
  }

  handleUpdateSimilar(clips) {
    this.state.similarClips = clips;
  }

  handleUpdateSingle(clipId) {
    this.state.clearSearch = true;
    const all = this.state.allClips;
    this.state.primaryClip = all[this.findIndex(all, 'id', clipId)] || this.state.primaryClip;
    this.state.matchingClips = [];
    this.state.similarClips = [];
  
    ClipActions.similar(this.state.primaryClip.id);
  }

  handleFail(errorMessage) {
    this.state.errorMessage = errorMessage;
  }

  handleRandom() {
    this.state.matchingClips = [];
    this.state.similarClips = [];
    const all = this.state.allClips;
    this.state.primaryClip = all[Math.floor(Math.random() * all.length)];
    this.handleComplete();

    ClipActions.similar(this.state.primaryClip.id);
  }

  handleClearSearch(confirmed) {
    this.state.clearSearch = confirmed;
  }

}

export default alt.createStore(ClipStore, 'ClipStore');
