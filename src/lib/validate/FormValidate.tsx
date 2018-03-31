import * as React from 'react';
import { ReactElement } from 'react';
import Validate from '../Validate';

interface FormProps {
  autoComplete: string;
  style: {};
  onChange: (valid: boolean) => void;
}

export default class FormValidate extends React.Component<FormProps> {

  state = {
    valid: false
  };

  private validators: {}[] = [];

  constructor(props: FormProps) {
    super(props);
  }

  render() {
    const { onChange, ...rest } = this.props;
    return (
      <form {...rest}>
        {React.Children.map(this.props.children, (
          child: ReactElement<{key: number, ref: (r: Validate) => void, onChange: () => void }>,
          i: number) => {
          this.validators = [];
          return React.cloneElement(child, {
            key: i,
            ref: (r: Validate) => {
              if (r) {
                this.validators.push(r);
              }
            },
            onChange: () => this.props.onChange(this.validate())
          });
        })}
      </form>
    );
  }

  private validate() {
    let valid = true;
    this.validators.some((validator: Validate) => {
      valid = validator.isValid();
      return !valid;
    });
    return valid;
  }
}
