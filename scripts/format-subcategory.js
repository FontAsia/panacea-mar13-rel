import { Common } from './common.js';
import { Config } from '../config.js';
import { App } from './app.js';
import { AppState } from './appstate.js';

export class FormatSubcategory {
  static getBarbaTransition() {
    return {
      name: `format-subcategory-transition`,
      to: {
        namespace: [`format-subcategory`],
      },
      leave(data) {
        console.log(`format-subcategory`, `leave`);
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log(`format-subcategory`, `once`);
        FormatSubcategory.onceEnterBarbaHook();
      },
      enter(data) {
        console.log(`format-subcategory`, `enter`);
        AppState.startPageTrack();
        FormatSubcategory.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log(`format-subcategory`, `afterOnce`);
        FormatSubcategory.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log(`format-subcategory`, `after`);
        FormatSubcategory.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    gsap.fromTo(`.format-subcategory`, { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    let tl = gsap.timeline({
      duration: 0.5,
      onComplete: () => {
        FormatSubcategory.bindEvents();
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
    $(`main > .format-subcategory > .touchpoint`).on(`click`, (event) => {
      $(`main > .format-subcategory > .touchpoint`).unbind(`click`);
      console.log('format-subcategory', $(event.currentTarget).data().to);

      let referrer = `${$('.format-subcategory').data().category}${$(event.currentTarget).data().from}`;
      App.redirectTo(`${Config.podURL}${$(event.currentTarget).data().to}/index.html?referrer=${referrer}`);
    });

    $(`.back-to-home-container > img`).on(`click`, (event) => {
      $(`.back-to-home-container > img`).unbind(`click`);
      App.redirectTo(`${Config.podURL}${$('.format-subcategory').data().category}/index.html`);
    });
  }
}
