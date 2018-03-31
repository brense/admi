import { observable } from 'mobx';
import Dialogs from '../lib/Dialogs';

export class ActionItem {
  icon: string;
  title: string;
  path: string;
  @observable quick: boolean;
  sidebar: boolean;
  action: string;
}

class ActionStore {

  @observable actions: {}[] = [
    {
      icon: 'schedule',
      title: 'Uren administratie',
      path: '/hours',
      quick: true,
      sidebar: true,
      action: 'addHours'
    } as ActionItem,
    {
      icon: 'receipt',
      title: 'Onkosten',
      path: '/expenses',
      quick: true,
      sidebar: true,
      action: 'addExpenses'
    } as ActionItem,
    {
      icon: 'note_add',
      title: 'Factuur maken',
      path: '/invoice',
      quick: false,
      sidebar: true
    } as ActionItem,
    {
      icon: 'note_add',
      title: 'Offerte schrijven',
      path: '/quotation',
      quick: false
    } as ActionItem,
    {
      icon: 'euro_symbol',
      title: 'Belastingaangifte',
      path: '/tax',
      quick: false,
      sidebar: true
    }
  ];

  private callbacks = {
    addHours: () => { Dialogs.open('addHours'); },
    addExpenses: () => { Dialogs.open('addExpenses'); }
  };

  doAction(action?: string) {
    if (action && this.callbacks[action]) {
      this.callbacks[action]();
    }
  }

}

export default new ActionStore();
