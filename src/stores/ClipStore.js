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
      handleWipeSearchTerm: ClipActions.WIPE_SEARCH_TERM,
    });

    this.state = {
      allClips: [],
      matchingClips: [],
      similarClips: [],
      primaryClip: null,
      errorMessage: null,
      loading: true,
      wipeSearchTerm: false,
    };
  }

  static getPrimaryClipID() {
    return this.state.primaryClip.id;
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
    this.state.matchingClips = [];
    this.state.similarClips = [];
    this.state.errorMessage = null;
  }

  loaded() {
    this.state.loading = false;
  }

  handleFetchingAll() {
    this.state.loading = true;
    this.reloading();
  }

  handleFetchingMatches() {
    this.reloading();
    this.state.wipeSearchTerm = false;
  }

  handleUpdateAll(clips) {
    this.state.loading = false;
    this.state.allClips = clips;
  }

  handleUpdateMatching(clips) {
    this.state.primaryClip = null; // TODO: Move this when primary and similar update together
    this.reloading();
    this.state.matchingClips = clips;
  }

  handleUpdateSimilar(clips) {
    this.reloading();
    this.state.wipeSearchTerm = false;
    this.state.similarClips = clips;
  }

  handleChangePrimary(clipId = null) {
    const all = this.state.allClips;
    const newPrimary = clipId ? all[this.findIndex(all, 'id', clipId)] :
                                all[Math.floor(Math.random() * all.length)];
    this.state.primaryClip = newPrimary;
    
    this.reloading();
    this.state.wipeSearchTerm = true;
    ClipActions.fetchSimilar(newPrimary.id);
  }

  handleCatchError(errorMessage) {
    this.state.errorMessage = errorMessage;
  }

  handleWipeSearchTerm(confirmed) {
    this.state.wipeSearchTerm = confirmed;
  }

}

export default alt.createStore(ClipStore, 'ClipStore');
