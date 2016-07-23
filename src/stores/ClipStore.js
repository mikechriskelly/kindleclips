import alt from '../core/alt';
import ClipActions from '../actions/ClipActions';

class ClipStore {

  constructor() {
    this.bindListeners({
      handleUpdating: ClipActions.SEARCH,
      handleUpdateAll: ClipActions.UPDATE_ALL,
      handleUpdateMatching: ClipActions.UPDATE_MATCHING,
      handleUpdateSimilar: ClipActions.UPDATE_SIMILAR,
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
    this.state.similarClips = [];
    this.state.matchingClips = clips;
    this.handleComplete();
  }

  handleUpdateSimilar(clips) {
    this.state.similarClips = clips;
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

}

export default alt.createStore(ClipStore, 'ClipStore');
