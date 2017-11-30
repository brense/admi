import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { pink, blue } from 'material-ui/colors';
import 'typeface-roboto';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { PrivateRoute } from './Auth';
import Dashboard from './Dashboard';
import Finances from './Finances';
import Profile from './Profile';
import Settings from './Settings';
import Hours from './Hours';
import Invoice from './Invoice';
import Projects from './Projects';
import Invoices from './Invoices';
import Contacts from './Contacts';
import Employees from './Employees';
import Tax from './Tax';
import Help from './Help';
import Login from './Login';

injectTapEventPlugin();

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  }
});

ReactDOM.render(
  <Router>
    <MuiThemeProvider theme={theme}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route
          component={() => (
            <App>
              <Switch>
                <PrivateRoute path="/profile" component={Profile} privs="user" />
                <PrivateRoute path="/settings" component={Settings} privs="user" />
                <PrivateRoute exact={true} path="/" component={Dashboard} privs="user" />
                <PrivateRoute path="/hours" component={Hours} privs="user" />
                <PrivateRoute path="/invoice" component={Invoice} privs="user" />
                <PrivateRoute path="/finances" component={Finances} privs="user" />
                <PrivateRoute path="/projects" component={Projects} privs="user" />
                <PrivateRoute path="/invoices" component={Invoices} privs="user" />
                <PrivateRoute path="/contacts" component={Contacts} privs="user" />
                <PrivateRoute path="/employees" component={Employees} privs="user" />
                <PrivateRoute path="/tax" component={Tax} privs="user" />
                <PrivateRoute path="/help" component={Help} privs="user" />
                <Redirect to="/" />
              </Switch>
            </App>
          )}
        />
      </Switch>
    </MuiThemeProvider>
  </Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
