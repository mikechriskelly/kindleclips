import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import FaCloudUpload from 'react-icons/lib/fa/cloud-upload';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Upload.css';
import Button from '../../components/Button';
import LoadSpinner from '../../components/LoadSpinner';

Upload.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

function Upload({ title, isLoading }) {
  return (
    <div className={s.root}>
      {isLoading ? <LoadSpinner /> : null}
      <div className={s.container}>
        <h3>
          {title}
        </h3>
        <Dropzone
          accept="text/plain"
          className={s.dropzone}
          multiple={false}
          /* onDrop={ClipActions.upload} */
        >
          <div className={s.content}>
            <FaCloudUpload size={42} />
            <p>Connect your Kindle to your computer.</p>
            <p>
              Upload the <strong>My Clippings.txt</strong> file from your Kindle
            </p>
          </div>
        </Dropzone>
        <div className={s.action}>
          <Dropzone
            accept="text/plain"
            multiple={false}
            className={s.clear}
            /* onDrop={ClipActions.upload} */
          >
            <Button text="Select File" type="primary" />
          </Dropzone>
          <Button text="Cancel" href="/" />
        </div>
      </div>
    </div>
  );
}

export default withStyles(s)(Upload);
