import * as React from 'react';
import { Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import Auth from '../lib/Auth';

class Login extends React.Component<RouteComponentProps<{}>> {

  private location: { pathname: string };

  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.location = props.location;
  }

  render() {
    return (
      <div>
        <p>Login</p>
        {Auth.isAuthenticated('user') && (<Redirect
          to={{
            pathname: '/',
            state: { from: this.location }
          }}
        />)}
      </div>
    );
  }
}

export default withRouter(Login);
