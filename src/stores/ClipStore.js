import alt from '../core/alt';
import ClipActions from '../actions/ClipActions';

class ClipStore {

  constructor() {
    this.bindListeners({
      handleFetching: ClipActions.FETCH_MATCHING,
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
      searchTerm: '',
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
    // Only use loading indicator for initial fetch
    this.state.loading = this.state.allClips.length === 0;

    this.state.matchingClips = [];
    this.state.similarClips = [];
    this.state.errorMessage = null;
  }

  loaded() {
    this.state.loading = false;
  }

  handleFetching(searchTerm) {
    this.loading();
    this.state.wipeSearchTerm = false;
    this.state.searchTerm = searchTerm;
  }

  handleUpdateAll(clips) {
    this.state.allClips = clips;
    this.loaded();
  }

  handleUpdateMatching(clips) {
    this.state.primaryClip = null; // TODO Remove. Primary/Similar should update together
    this.reloading();
    this.state.matchingClips = clips;
    this.loaded();
  }

  handleUpdateSimilar(clips) {
    this.reloading();
    this.state.similarClips = clips;
    this.loaded();
  }

  handleChangePrimary(clipId = null) {
    this.reloading();
    this.state.wipeSearchTerm = true;

    const all = this.state.allClips;
    const newPrimary = clipId ? all[this.findIndex(all, 'id', clipId)] :
                                all[Math.floor(Math.random() * all.length)];

    this.state.primaryClip = newPrimary;
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
