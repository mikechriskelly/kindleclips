import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import Button from './../components/Button';
import LoadSpinner from './../components/LoadSpinner';
import { uploadClips } from './../modules/clips';

class UploadPage extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    isLoading: false,
    onSubmit: null,
  };

  render() {
    return (
      <OuterContainer>
        {this.props.isLoading ? <LoadSpinner /> : null}
        <InnerContainer>
          <h3>Upload</h3>
          <BigDropzone
            accept="text/plain"
            multiple={false}
            onDrop={this.props.onSubmit}
          >
            <Content>
              <p>Connect your Kindle to your computer.</p>
              <p>
                Upload the <strong>My Clippings.txt</strong> file from your
                Kindle
              </p>
            </Content>
          </BigDropzone>
          <Action>
            <ButtonDropzone
              accept="text/plain"
              multiple={false}
              onDrop={this.props.onSubmit}
            >
              <Button label="Select File" type="primary" />
            </ButtonDropzone>
            <Button label="Cancel" href="/" />
          </Action>
        </InnerContainer>
      </OuterContainer>
    );
  }
}

const OuterContainer = styled.div`
  position: absolute;
  top: 25%;
  width: 100%;
`;

const InnerContainer = styled.div`
  background-color: var(--white-base);
  border-radius: 5px;
  margin: auto auto;
  max-width: 650px;
  padding: 25px;
  text-align: center;
`;

const BigDropzone = styled(Dropzone)`
  background-color: var(--gray-lighter);
  border-color: #666;
  border-radius: 5px;
  border-style: dashed;
  border-width: 2px;
  cursor: pointer;
  display: inline-flex;
  height: 200px;
  width: 100%;
`;

const ButtonDropzone = styled(Dropzone)`
  border: none;
  display: inline-block;
  height: auto;
  width: auto;
`;

const Content = styled.div`
  color: var(--gray-dark);
  margin: auto auto;
  text-align: center;
`;

const Action = styled.div`margin-top: 25px;`;

function mapStateToProps(state) {
  return {
    clips: state.clips,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: files => dispatch(uploadClips(files)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadPage);
