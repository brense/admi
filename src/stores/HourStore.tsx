import { observable } from 'mobx';

class HourStore {

  @observable hours: {}[] = [];

}

export default new HourStore();
