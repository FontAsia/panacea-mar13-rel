import { Common } from './common.js';
import { Config } from '../config.js';
import { App } from './app.js';
import { AppState } from './appstate.js';

export class NeedSubcategory {
  static getBarbaTransition() {
    return {
      name: `need-subcategory-transition`,
      to: {
        namespace: [`need-subcategory`],
      },
      leave(data) {
        console.log(`need-subcategory`, `leave`);
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log(`need-subcategory`, `once`);
        NeedSubcategory.onceEnterBarbaHook();
      },
      enter(data) {
        console.log(`need-subcategory`, `enter`);
        AppState.startPageTrack();
        NeedSubcategory.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log(`need-subcategory`, `afterOnce`);
        NeedSubcategory.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log(`need-subcategory`, `after`);
        NeedSubcategory.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    gsap.fromTo(`.need`, { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    let tl = gsap.timeline({
      duration: 0.5,
      onComplete: () => {
        NeedSubcategory.bindEvents();
        AppState.restartIdleTimer(() => {
          barba.go(`${Config.podURL}`);
        });
      },
    });

    let touchpoints = $('.touchpoint').toArray();
    touchpoints.sort(() => {
      return 0.5 - Math.random();
    });

    tl.fromTo(touchpoints, { autoAlpha: 0, opacity: 0, y: 50 }, { autoAlpha: 1, opacity: 1, y: 0, stagger: 0.1 });
  }

  static bindEvents() {
    $(`main > .need-subcategory > .touchpoint`).on(`click`, (event) => {
      $(`main > .need-subcategory > .touchpoint`).unbind(`click`);
      console.log('need-subcategory', $(event.currentTarget).data().to);
      let referrer = `${$('.need-subcategory').data().category}${$(event.currentTarget).data().from}`;
      App.redirectTo(`${Config.podURL}${$(event.currentTarget).data().to}/index.html?referrer=${referrer}`);
    });

    $(`.back-to-home-container > img`).on(`click`, (event) => {
      $(`.back-to-home-container > img`).unbind(`click`);
      App.redirectTo(`${Config.podURL}${$('.need-subcategory').data().category}/index.html`);
    });
  }
}
