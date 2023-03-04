import { Common } from './common.js';
import { Config } from '../config.js';
import { App } from './app.js';
import { AppState } from './appstate.js';

export class RangeSubcategory {
  static getBarbaTransition() {
    return {
      name: `range-subcategory-transition`,
      to: {
        namespace: [`range-subcategory`],
      },
      leave(data) {
        console.log('range-subcategory', `leave`);
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log('range-subcategory', `once`);
        RangeSubcategory.onceEnterBarbaHook();
      },
      enter(data) {
        console.log('range-subcategory', `enter`);
        AppState.startPageTrack();
        RangeSubcategory.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log('range-subcategory', `afterOnce`);
        RangeSubcategory.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log('range-subcategory', `after`);
        RangeSubcategory.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    gsap.fromTo(`.range-subcategory`, { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    let tl = gsap.timeline({
      duration: 0.5,
      onComplete: () => {
        RangeSubcategory.bindEvents();
        AppState.restartIdleTimer(() => {
          barba.go(`${Config.podURL}`);
        });
      },
    });

    tl.fromTo('.products', { autoAlpha: 0, opacity: 0, y: 100 }, { autoAlpha: 1, opacity: 1, y: 0, delay: 0.5 });
  }

  static bindEvents() {
    let referrer = Common.getQueryParameterByName('referrer');

    $(`.pulse-button, .pulse-button-small`).on(`click`, (event) => {
      $(`.pulse-button, .pulse-button-small`).unbind(`click`);
      console.log('DISCOVER', $(event.currentTarget).data().to);
      let referrer = `${$('.range-subcategory').data().category}${$(event.currentTarget).data().from}`;
      App.redirectTo(`${Config.podURL}${$(event.currentTarget).data().to}/index.html?referrer=${referrer}`);
    });

    $(`.back-container > img`).on(`click`, (event) => {
      $(`.back-container > img`).unbind(`click`);
      App.redirectTo(`${Config.podURL}${$('.range-subcategory').data().category}/index.html`);
    });
  }
}
