import alt from '../core/alt';
import ClipActions from '../actions/ClipActions';

class ClipStore {

  constructor() {
    this.bindListeners({
      handleFetchingAll: ClipActions.FETCH_ALL,
      handleFetchingMatches: ClipActions.FETCH_MATCHING,
      handleUpdateAll: ClipActions.UPDATE_ALL,
      handleUpdateMatching: ClipActions.UPDATE_MATCHING,
      handleUpdateSimilar: ClipActions.UPDATE_SIMILAR,
      handleChangePrimary: ClipActions.CHANGE_PRIMARY,
      handleCatchError: ClipActions.CATCH_ERROR,
    });

    this.state = {
      allClips: [],
      matchingClips: [],
      similarClips: [],
      primaryClip: null,
      errorMessage: null,
      searchTerm: null,
      wipeSearch: 'Pristine',
    };
  }

  static getPrimaryClipID() {
    return this.state.primaryClip.id;
  }

  randomKey() {
    return Math.random().toString(36).substr(2, 9);
  }

  findIndex(array, attr, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  reloading() {
    this.state.searchTerm = null;
    this.state.matchingClips = [];
    this.state.similarClips = [];
    this.state.errorMessage = null;
  }

  handleFetchingAll() {
    this.reloading();
  }

  handleFetchingMatches() {
    this.reloading();
  }

  handleUpdateAll(clips) {
    this.state.allClips = clips;
    if (clips.length > 0) this.state.errorMessage = null;
  }

  handleUpdateMatching({ clips, searchTerm }) {
    this.state.primaryClip = null; // TODO: Move this when primary and similar update together
    this.reloading();
    this.state.matchingClips = clips;
    this.state.searchTerm = searchTerm;
    this.state.errorMessage = null;
  }

  handleUpdateSimilar(clips) {
    this.reloading();
    this.state.similarClips = clips;
    this.state.errorMessage = null;
  }

  handleChangePrimary(clipId) {
    const all = this.state.allClips;
    const newPrimary = clipId ? all[this.findIndex(all, 'id', clipId)] :
                                all[Math.floor(Math.random() * all.length)];
    this.state.primaryClip = newPrimary;

    this.reloading();
    this.state.wipeSearchTerm = this.randomKey();
    ClipActions.fetchSimilar(newPrimary.id);
    this.state.errorMessage = null;
  }

  handleCatchError(errorMessage) {
    this.state.errorMessage = errorMessage;
  }
}

export default alt.createStore(ClipStore, 'ClipStore');
