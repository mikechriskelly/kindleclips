import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import SearchActions from '../../actions/SearchActions';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Upload.css';

const title = 'Upload Your Clippings';

function Upload(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{title}</h1>
        <Dropzone
          accept="text/plain"
          className={s.dropzone}
          multiple={false}
          onDrop={SearchActions.uploadClips}
        >
          <p>
            Add "My Clippings.txt" file from your Kindle
          </p>
        </Dropzone>
      </div>
    </div>
  );
}

Upload.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Upload);
