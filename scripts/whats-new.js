import { Common } from './common.js';
import { Config } from '../config.js';
import { App } from './app.js';
import { AppState } from './appstate.js';

export class WhatsNew {
  static getBarbaTransition() {
    return {
      name: `whats-new-transition`,
      to: {
        namespace: [`whats-new`],
      },
      leave(data) {
        console.log('whats-new', `leave`);
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log('whats-new', `once`);
        WhatsNew.onceEnterBarbaHook();
      },
      enter(data) {
        console.log('whats-new', `enter`);
        AppState.startPageTrack();
        WhatsNew.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log('whats-new', `afterOnce`);
        WhatsNew.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log('whats-new', `after`);
        WhatsNew.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    // var elements = gsap.utils.toArray(
    //   document.querySelectorAll('.whats-new, .whats-new-bright-brilliance, .whats-new-hyaluron')
    // );

    gsap.fromTo('.whats-new', { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    let tl = gsap.timeline({
      duration: 0.5,
      onComplete: () => {
        WhatsNew.bindEvents();
        AppState.restartIdleTimer(() => {
          barba.go(`${Config.podURL}`);
        });
      },
    });

    tl.fromTo('.products', { autoAlpha: 0, opacity: 0, y: 100 }, { autoAlpha: 1, opacity: 1, y: 0, delay: 0.5 });
  }

  static unbindEvents() {
    $('.pulse-button').unbind('click');
    $('.back-container > img').unbind('click');
  }

  static bindEvents() {
    $('.pulse-button').on(`click`, (event) => {
      WhatsNew.unbindEvents();
      console.log('DISCOVER', $(event.currentTarget).data().to);
      App.redirectTo(
        `${Config.podURL}${$(event.currentTarget).data().to}/index.html?referrer=${$(event.currentTarget).data().from}`
      );
    });

    $('.back-container > img').on(`click`, (event) => {
      WhatsNew.unbindEvents();
      App.redirectTo(`${Config.podURL}/menu-${Config.menuVersion}/index.html`);
    });
  }
}
