import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import ClipActions from '../../actions/ClipActions';
import Button from '../../components/Button';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Upload.css';
import { FaCloudUpload } from 'react-icons/lib/fa';

const title = 'Upload Your Clippings';

function Upload(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h3>{title}</h3>
        <Dropzone
          accept="text/plain"
          className={s.dropzone}
          multiple={false}
          onDrop={ClipActions.upload}
        >
          <div className={s.content}>
            <FaCloudUpload size={42} />
            <p>Connect your Kindle to your computer.</p>
            <p>Upload the <strong>My Clippings.txt</strong> file from your Kindle</p>
          </div>
        </Dropzone>
        <div className={s.action}>
          <Dropzone
            accept="text/plain"
            multiple={false}
            className={s.clear}
            onDrop={ClipActions.upload}>
              <Button text="Select File" type="primary" />
          </Dropzone>
          <Button text="Cancel" href="/" />
        </div>
      </div>
    </div>
  );
}

Upload.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Upload);
