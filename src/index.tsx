import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { pink, blue } from 'material-ui/colors';
import 'typeface-roboto';
import 'material-design-icons/iconfont/material-icons.css';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { PrivateRoute, Auth } from './lib/Auth';
import Gapi from './lib/Gapi';
import App from './App';
import {
  Dashboard, Finances, Profile, Settings, Hours, Expenses, Invoice,
  Projects, Invoices, Contacts, Employees, Tax, Help, Login
} from './Views';

import * as moment from 'moment';
import 'moment/locale/nl';
moment.locale('nl');

import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';

injectTapEventPlugin();

const theme = createMuiTheme({
  palette: {
    primary: {
      ...blue,
      500: '#2962FF' // A700
    },
    secondary: {
      ...pink,
      A200: '#F50057' // A400
    }
  }
});

Gapi.init({
  clientId: '312273700917-cshh30k7442t7v1e0gl73lub68ne7uv3.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly'
});

Gapi.onLoad().then(() => {
  Gapi.authorize().then((result) => {
    console.log('auth', result);
    Auth.init(); // TODO: implement Auth.init...
  });
});

ReactDOM.render(
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <MuiThemeProvider theme={theme}>
      <Router>
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
                  <PrivateRoute path="/expenses" component={Expenses} privs="user" />
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
      </Router>
    </MuiThemeProvider>
  </MuiPickersUtilsProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
