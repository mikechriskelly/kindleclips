import alt from '../core/alt';
import ClipActions from '../actions/ClipActions';

class ClipStore {

  constructor() {
    this.bindListeners({
      handleFetching: ClipActions.FETCHING,
      handleUpdatePrimary: ClipActions.UPDATE_PRIMARY,
      handleUpdateMatching: ClipActions.UPDATE_MATCHING,
      handleCatchError: ClipActions.CATCH_ERROR,
      handleNoClips: ClipActions.NO_CLIPS,
    });

    this.state = {
      primaryClip: null,
      similarClips: [],
      matchingClips: [],
      errorMessage: null,
      searchTerm: null,
      searchKey: this.randomKey(),
      noClips: true,
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

  handleFetching() {
    this.state.loading = true;
    this.state.errorMessage = null;
    this.state.noClips = false;
  }

  handleUpdatePrimary(clip) {
    this.state.searchTerm = null;
    this.state.searchKey = this.randomKey();
    this.state.matchingClips = [];

    this.state.primaryClip = {
      id: clip.id,
      title: clip.title,
      author: clip.author,
      text: clip.text,
    };
    this.state.similarClips = clip.similarClips;
  }

  handleUpdateMatching({ clips, searchTerm }) {
    this.state.primaryClip = null;
    this.state.similarClips = [];

    this.state.matchingClips = clips;
    this.state.searchTerm = searchTerm;
  }

  handleCatchError(errorMessage) {
    this.state.errorMessage = errorMessage;
  }

  handleNoClips() {
    this.state.noClips = true;
  }
}

export default alt.createStore(ClipStore, 'ClipStore');
