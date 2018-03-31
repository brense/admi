import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import { Subject } from 'rxjs';

class BasicDialog extends React.Component<{ title?: string }> {

  state = {
    open: false
  };

  public onSave = new Subject();
  public onClose = new Subject();
  public onOpen = new Subject();

  constructor(props: { title: string }) {
    super(props);

    this.open = this.open.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  open() {
    this.setState({ open: true });
    this.onOpen.next();
  }
  cancel() {
    this.setState({ open: false });
    this.onClose.next();
  }

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.cancel} title={this.props.title}>
        {this.props.children}
      </Dialog>
    );
  }

}

export default BasicDialog;
