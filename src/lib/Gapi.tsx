import loadExternalScript from './LoadExternalScript';

declare const gapi: {
  load: Function,
  auth2: { init: Function, signIn: Function, currentUser: { get: Function } }
};

class Gapi {

  private clientId: string;
  // private apiKey: string;
  private scope: string;

  private onLoadPromise: Promise<{}>;
  private onAuthorizePromise: Promise<{}>;

  init(options: { clientId: string, apiKey?: string, scope?: string }) {
    this.clientId = options.clientId;
    // this.apiKey = apiKey;
    this.scope = options.scope || '';
    this.onLoadPromise = new Promise((resolve: () => void, reject: () => void) => {
      loadExternalScript('https://apis.google.com/js/platform.js', 'gapi', () => {
        gapi.load('client:auth2', resolve);
      });
    });
    return this.onLoadPromise;
  }

  onLoad() {
    return this.onLoadPromise;
  }

  onAuthorize() {
    return this.onAuthorizePromise;
  }

  authorize() {
    this.onAuthorizePromise = new Promise((
      resolve: (auth: {
        authResponse: {},
        profile: {}
      }) => void,
      reject: () => void) => {
      gapi.auth2.init({
        client_id: this.clientId,
        cookiepolicy: 'single_host_origin',
        scope: this.scope
      })
        .then((authInstance: {
          isSignedIn: { get: Function },
          signIn: Function,
          currentUser: { get: Function }
        }) => {
          if (!authInstance.isSignedIn.get()) {
            reject();
          } else {
            resolve(this.getAuthResponse(authInstance.currentUser.get()));
          }
        });
    });
    return this.onAuthorizePromise;
  }

  signIn() {
    return new Promise((
      resolve: (auth: {
        authResponse: {},
        profile: {}
      }) => void,
      reject: () => void) => {
      gapi.auth2.signIn().then(() => { // TODO: remove sign in... only sign in when user clicks a button...
        resolve(this.getAuthResponse(gapi.auth2.currentUser.get()));
      });
    });
  }

  private getAuthResponse(authInstance: { getAuthResponse: Function, getBasicProfile: Function }) {
    const authResponse = authInstance.getAuthResponse();
    const profile = authInstance.getBasicProfile();
    return {
      authResponse: authResponse,
      profile: {
        id: profile.getId(),
        name: profile.getName(),
        firstname: profile.getGivenName(),
        lastname: profile.getFamilyName(),
        profileImage: profile.getImageUrl(),
        email: profile.getEmail()
      }
    };
  }

}

export default new Gapi();

/*
gapi.client.init({
  apiKey: 'AIzaSyD3AEEIKBUc6NoPrSe7BKM69oeJHckS2d4',
  clientId: '312273700917-cshh30k7442t7v1e0gl73lub68ne7uv3.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/admin.directory.user.readonly',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest']
}).then(() => {
  gapi.client.directory.users.list({
    'customer': 'my_customer',
    'maxResults': 10,
    'orderBy': 'email'
  }).then((response: { result: { users: {} }}) => {
    console.log('users', response.result.users);
  });
});
*/
