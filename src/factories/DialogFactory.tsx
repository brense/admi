import * as React from 'react';
import Dialog from 'material-ui/Dialog';

export default class BasicDialog extends React.Component<{title: string}> {

    state = {
        open: false
    }

    constructor(props: any) {
        super(props);

        this.cancel = this.cancel.bind(this);
        this.open = this.open.bind(this);
    }

    open() {
        this.setState({ open: true });
    }
    cancel() {
        this.setState({ open: false });
    }

    render() {
        return (
            <Dialog open={this.state.open} onRequestClose={this.cancel} title={this.props.title}>
                {this.props.children}
            </Dialog>
        );
    }
}
