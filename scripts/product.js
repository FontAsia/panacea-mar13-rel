import { Common } from './common.js';
import { Config } from '../config.js';
import { App } from './app.js';
import { AppState } from './appstate.js';

export class Product {
  static currentSection = '';

  static getBarbaTransition() {
    return {
      name: `product`,
      to: {
        namespace: [`product`],
      },
      leave(data) {
        console.log('product', `leave`);
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log('product', `once`);
        Product.onceEnterBarbaHook();
      },
      enter(data) {
        console.log('product', `enter`);
        AppState.startPageTrack();
        Product.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log('product', `afterOnce`);
        Product.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log('product', `after`);
        Product.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    gsap.fromTo(`.product`, { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    Product.scrollTo(
      'home-section',
      () => {},
      () => {
        Common.homeAnimation();
        Product.bindEvents();
        AppState.restartIdleTimer(() => {
          barba.go(`${Config.podURL}`);
        });
      }
    );
  }

  static scrollTo(target, startCb, completeCb) {
    gsap.to(window, {
      scrollTo: `#${target}`,
      ease: Expo.easeOut,
      onStart: startCb,
      onComplete: () => {
        completeCb();
        Product.currentSection = target;
      },
    });
  }

  static navigationClickHandler(sectionName) {
    //gsap.set(".instruction-section", {autoAlpha: 0, opacity: 0 } );
    let nextSection = sectionName;
    if (nextSection == Product.currentSection) {
      Product.unbindEvents();
      Product.bindEvents();
      return;
    }

    Product.scrollTo(
      nextSection,
      () => {
        Product.unbindEvents();
        if (Product.currentSection !== 'home-section') {
          Product.unfocus(`#${Product.currentSection.replace('-section', '')}`);
        }
        Product.focus(`#${nextSection.replace('-section', '')}`);
      },
      () => {
        console.log('complete');
        Product.bindEvents();
        AppState.restartIdleTimer(() => {
          barba.go(`${Config.podURL}`);
        });
      }
    );
  }

  static bindEvents() {
    $('.navigation-container').on('click', (event) => {
      if (AppState.getSessionType() == 'remote') {
        gsap.fromTo('.instruction-section', { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, duration: 0.5 });
        FIRESTORE.collection(App.COMMANDS_COLLECTION).doc(AppState.getDeviceId()).set({ command: '' });
        return;
      }
      Product.navigationClickHandler(`${$(event.target)[0].id}-section`);
    });

    let referrer = Common.getQueryParameterByName('referrer');

    $('.pulse-button, .pulse-button-small').on('click', (event) => {
      Product.unbindEvents();
      console.log('DISCOVER', $(event.currentTarget).data().to);
      App.redirectTo(`${Config.podURL}${$(event.currentTarget).data().to}/index.html?referrer=${referrer}`);
    });

    $('.close-button').on('click', () => {
      Product.unbindEvents();
      if (referrer == undefined || referrer == '') {
        App.redirectTo(`${Config.podURL}/menu-${Config.menuVersion}/index.html`);
      } else {
        App.redirectTo(`${Config.podURL}${referrer}/index.html`);
      }
    });
  }

  static unbindEvents() {
    $('.navigation-container').unbind('click');
    $('.pulse-button').unbind('click');
    $('.close-button').unbind('click');
  }

  static focus(selector) {
    gsap.fromTo(selector, { backgroundColor: '#f9d6de' }, { backgroundColor: '#ffffff' });
  }

  static unfocus(selector) {
    gsap.fromTo(selector, { backgroundColor: '#ffffff' }, { backgroundColor: '#f9d6de' });
  }
}
