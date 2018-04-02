import { observable } from 'mobx';

class AuthStore {

  @observable token: string;

}

export default new AuthStore();
