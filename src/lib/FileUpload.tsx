import * as React from 'react';
import { FormLabel, FormControl, FormHelperText } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Dropzone from 'react-dropzone';
import { Close } from 'material-ui-icons';
import { grey } from 'material-ui/colors';
const imagesColor = require('../file-type-icons/images_color.svg');
const pdfColor = require('../file-type-icons/pdf_color.svg');
const fileColor = require('../file-type-icons/doc_bw.svg');

interface Props {
  label?: string;
  helperText?: string;
  onChange?: Function;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  margin?: 'none' | 'dense' | 'normal';
}

class FileUpload extends React.Component<Props> {

  state = {
    files: []
  };

  private dropzoneRef: Dropzone;

  render() {
    const { label, helperText, margin, onChange, ...rest } = this.props;
    return (
      <FormControl margin={margin} required={true}>
        {label && <FormLabel>{label}</FormLabel>}
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        <div style={{ marginTop: 8, maxWidth: 383 }}>
          {this.state.files.length > 0 && this.state.files.map(
            (file: { name: string, size: number, type: string }, i: number) => [(
              <Button
                variant="raised"
                key={i}
                style={{
                  marginBottom: 8,
                  marginRight: 4,
                  textTransform: 'none',
                  backgroundColor: grey['100']
                }}
              >
                <img src={this.fileType(file.type)} alt={file.type} />&nbsp;
                  <span
                    style={{
                      maxWidth: 90,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                  {file.name}
                  </span>&nbsp;{this.fileSize(file.size)}
                &nbsp;<Close
                  style={{ height: 20, width: 20 }}
                  onClick={() => {
                    this.state.files.splice(i, 1);
                    this.setState({ files: this.state.files });
                    if (onChange) {
                      onChange(this.state.files);
                    }
                  }}
                />
              </Button>
            ), ' ']
          )}
          {(this.props.multiple || this.state.files.length === 0) && (
            <Button
              color="primary"
              style={{ display: 'block', marginBottom: 7 }}
              onClick={() => { this.dropzoneRef.open(); }}
            >
              Bestand toevoegen
            </Button>
          )}
          <Dropzone
            {...rest}
            ref={(d: Dropzone) => { this.dropzoneRef = d; }}
            style={{ display: 'none' }}
            onDrop={(accepted, rejected) => {
              if (this.state.files.length > 0 && this.props.multiple) {
                const files = this.state.files.concat(accepted as [never]);
                this.setState({ files: files });
                if (onChange) {
                  onChange(files);
                }
              } else {
                this.setState({ files: accepted });
                if (onChange) {
                  onChange(accepted);
                }
              }
            }}
          />
        </div>
      </FormControl>
    );
  }

  private fileSize(size: number) {
    let n = 1;
    while (size > 1024) {
      size = size / 1024;
      n++;
    }
    let text = 'b';
    if (n > 3) {
      text = 'Gb';
      size = Math.round(size * 100) / 100;
    } else if (n > 2) {
      text = 'Mb';
      size = Math.round(size * 100) / 100;
    } else if (n > 1) {
      text = 'Kb';
      size = Math.round(size);
    }
    return size + text;
  }

  private fileType(type: string) {
    if (type.indexOf('image') >= 0) {
      return imagesColor;
    }
    if (type.indexOf('pdf') >= 0) {
      return pdfColor;
    }
    return fileColor;
  }

}

export default FileUpload;
