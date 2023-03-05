import { Home } from './home.js';
import { Menu } from '../menu/scripts/menu.js';
import { WhatsNew } from './whats-new.js';
import { WhatsTrending } from './whats-trending.js';
import { Category } from './category.js';
import { NeedSubcategory } from './need-subcategory.js';
import { RangeSubcategory } from './range-subcategory.js';
import { FormatSubcategory } from './format-subcategory.js';
import { Product } from './product.js';
import { Common } from './common.js';
import { Config } from '../config.js';
import { AppState } from './appstate.js';

export class App {
  static COMMANDS_COLLECTION = 'commands';
  static init() {
    gsap.registerPlugin(ScrollToPlugin);
    let deviceId = Common.getQueryParameterByName('deviceId');

    if (deviceId !== undefined && deviceId !== null && deviceId !== '') {
      AppState.setDeviceId(deviceId);
    }

    if (AppState.getDeviceId() == undefined || AppState.getDeviceId() == 'null') {
      alert('device id undefined');
      return;
    }

    if (`${Config.isOnline}`) {
      App.startCommandListener();
    }
    App.initBarba();
  }

  static createTransitions() {
    let transactions = [];

    transactions.push(Home.getBarbaTransition());
    transactions.push(Menu.getBarbaTransition());
    transactions.push(WhatsNew.getBarbaTransition());
    transactions.push(WhatsTrending.getBarbaTransition());
    transactions.push(Category.getBarbaTransition());
    transactions.push(NeedSubcategory.getBarbaTransition());
    transactions.push(RangeSubcategory.getBarbaTransition());
    transactions.push(FormatSubcategory.getBarbaTransition());
    transactions.push(Product.getBarbaTransition());

    return transactions;
  }

  static initBarba() {
    console.log('initialize barba');
    barba.init({
      sync: false,
      transitions: App.createTransitions(),
    });
  }

  static startCommandListener() {
    FIRESTORE.collection(App.COMMANDS_COLLECTION).doc(AppState.getDeviceId()).set({ command: '' });
    console.log('App', 'starting command listener...');
    FIRESTORE.collection(App.COMMANDS_COLLECTION)
      .doc(AppState.getDeviceId())
      .onSnapshot(function (snapshot) {
        if (snapshot.data() !== undefined) {
          gsap.set('.instruction-section', { autoAlpha: 0, opacity: 0 });
          if (snapshot.data().command != '') {
            if (snapshot.data().command.includes('##')) {
              let scrollTo = `${snapshot.data().command.replace('##', '')}-section`;
              Product.navigationClickHandler(scrollTo);
            } else {
              console.log('command', snapshot.data().command);
              barba.go(`${Config.podURL}${snapshot.data().command}`);
            }
          } else {
            console.log('ignore');
          }
        }
      });
  }

  static redirectTo(path) {
    if (`${Config.isOnline}` && AppState.getSessionType() == 'remote') {
      gsap.fromTo('.instruction-section', { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, duration: 0.5 });
      FIRESTORE.collection(App.COMMANDS_COLLECTION).doc(AppState.deviceId).set({ command: '' });
      return;
    }
    barba.go(path);
  }
}
