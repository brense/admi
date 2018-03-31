import * as React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { Subject } from 'rxjs/Subject';

export const Auth = {
  isAuthenticated: (privs: string) => {
    // TODO: actually check privs
    return true;
  },
  authenticatedUser: {},
  onLogin: new Subject(),
  onLogout: new Subject(),
  setAuthenticatedUser(user: {}) {
    this.authenticatedUser = user;
    this.onAuthenticatedUserUpdated.next(user);
  },
  onAuthenticatedUserUpdated: new Subject(),
  authenticate(username: string, password: string) {
    // TODO: authenticate with facebook
    this.onLogin.next();
  },
  signout(cb: () => void) {
    console.log('signout');
    this.onLogout.next();
    /*
    this.authenticatedUser = {};
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    this.onLogout();
    cb();
    */
  }
};

export const Logout = withRouter(({ history, children }) => (
  <span onClick={() => { Auth.signout(() => history.push('/')); }}>{children}</span>
));

export const PrivateRoute = (
  { component: Component, privs, ...rest }:
  { component: React.ComponentClass<{}>, privs: string, path?: string, exact?: boolean }) => (
  <Route
    {...rest}
    render={props => (
      Auth.isAuthenticated(privs) ? (<Component {...props} />) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    )}
  />
);

export default Auth;
