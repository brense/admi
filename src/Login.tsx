import * as React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Auth from './Auth';

class Login extends React.Component<{ history?: any, location?: any }> {
  render() {
    return (
      <div>
        <p>Login</p>
        {Auth.isAuthenticated('user') && (<Redirect
          to={{
            pathname: '/',
            state: { from: this.props.location }
          }}
        />)}
      </div>
    );
  }
}

export default withRouter(Login);
