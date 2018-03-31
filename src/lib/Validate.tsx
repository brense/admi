import * as React from 'react';
import { ReactElement } from 'react';

interface ValidateProps {
  errorMessage: string;
  required?: boolean;
  onChange?: (e: {}) => void;
}

export { default as FormValidate } from './validate/FormValidate';

export default class Validate extends React.Component<ValidateProps> {

  state = {
    touched: false,
    helperText: ''
  };

  private cachedHelperText: string = '';

  private child: ReactElement<{
    required: boolean,
    value: string,
    onBlur: () => void,
    error: boolean,
    onChange: (e: {}) => void,
    helperText: string
  }>;

  isValid() {
    if (this.props.required && (!this.child.props.value || this.child.props.value.length === 0)) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.child = React.Children.only(this.props.children);
    this.cachedHelperText = this.child.props.helperText || '';
  }

  render() {
    this.child = React.Children.only(this.props.children);
    const originalOnChange = this.child.props.onChange;
    return React.cloneElement(this.child, {
      helperText: (!this.state.touched || this.isValid()) ? this.cachedHelperText : this.props.errorMessage,
      required: this.props.required,
      onBlur: () => { this.setState({ touched: true }); },
      error: !(!this.state.touched || this.isValid()),
      onChange: (e: {}) => {
        originalOnChange(e);
        setTimeout(
          () => {
            if (this.props.onChange) {
              this.props.onChange(e);
            }
          },
          1
        );
      }
    });
  }

}
