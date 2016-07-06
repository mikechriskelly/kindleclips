import alt from '../core/alt';
import ClipActions from '../actions/ClipActions';

class ClipStore {

  constructor() {
    this.bindListeners({
      handleSearch: ClipActions.SEARCH,
      handleUpdateAll: ClipActions.UPDATE_ALL,
      handleUpdateMatching: ClipActions.UPDATE_MATCHING,
      handleFail: ClipActions.UPDATE_FAIL,
      handleRandom: ClipActions.RANDOM,
    });

    this.state = {
      allClips: [],
      matchingClips: [],
      similarClips: [],
      primaryClip: null,
      errorMessage: null,
    };
  }

  handleSearch() {
    this.state.matchingClips = [];
    this.state.primaryClip = null;
    this.state.similarClips = null;
    this.state.errorMessage = null;
  }

  handleUpdateAll(clips) {
    this.state.allClips = clips;
  }

  handleUpdateMatching(clips) {
    this.state.primaryClip = null;
    this.state.matchingClips = clips;
  }

  handleFail(errorMessage) {
    this.state.errorMessage = errorMessage;
  }

  handleRandom() {
    this.state.matchingClips = [];
    const all = this.state.allClips;
    this.state.primaryClip = all[Math.floor(Math.random() * all.length)];
  }

}

export default alt.createStore(ClipStore, 'ClipStore');
