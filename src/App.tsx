import * as React from 'react';
import './App.css';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Dialogs from './lib/Dialogs';
import Sidebar from './components/Sidebar';
import AddHoursDialog from './components/AddHoursDialog';
import AddExpensesDialog from './components/AddExpensesDialog';

class App extends React.Component<RouteComponentProps<{}>> {

  state = {
    activeStep: 0,
    type: ''
  };

  private history: {
    location: { pathname: string },
    push: (path: string, state?: {}) => void
  };

  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.history = props.history;
  }

  componentDidMount() {
    Dialogs.onSave('addHours').subscribe(() => {
      this.history.push('/hours');
    });
    Dialogs.onSave('addExpenses').subscribe(() => {
      this.history.push('/expenses');
    });
  }

  render() {
    return (
      <div className="App">
        <AddHoursDialog ref={(d: AddHoursDialog) => { Dialogs.addRef('addHours', d); }} />
        <AddExpensesDialog ref={(d: AddExpensesDialog) => { Dialogs.addRef('addExpenses', d); }} />
        <Sidebar />
        <main>{this.props.children}</main>
      </div>
    );
  }

}

export default withRouter(App);
