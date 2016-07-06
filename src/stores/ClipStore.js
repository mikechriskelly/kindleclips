import alt from '../core/alt';
import ClipActions from '../actions/ClipActions';

class ClipStore {

  constructor() {
    this.bindListeners({
      handleUpdating: ClipActions.SEARCH,
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
      loading: true,
    };
  }

  handleUpdating() {
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
    this.state.matchingClips = clips;
    this.handleComplete();
  }

  handleFail(errorMessage) {
    this.state.errorMessage = errorMessage;
  }

  handleRandom() {
    this.state.matchingClips = [];
    const all = this.state.allClips;
    this.state.primaryClip = all[Math.floor(Math.random() * all.length)];
    this.handleComplete();
  }

}

export default alt.createStore(ClipStore, 'ClipStore');
