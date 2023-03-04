import { Common } from './common.js';
import { Config } from '../config.js';
import { App } from './app.js';
import { AppState } from './appstate.js';

export class WhatsTrending {
  static getBarbaTransition() {
    return {
      name: `whats-trending-transition`,
      to: {
        namespace: [`whats-trending`],
      },
      leave(data) {
        console.log('whats-trending', `leave`);
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log('whats-trending', `once`);
        WhatsTrending.onceEnterBarbaHook();
      },
      enter(data) {
        console.log('whats-trending', `enter`);
        AppState.startPageTrack();
        WhatsTrending.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log('whats-trending', `afterOnce`);
        WhatsTrending.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log('whats-trending', `after`);
        WhatsTrending.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    gsap.fromTo(`.subcategory`, { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    let tl = gsap.timeline({
      duration: 0.5,
      onComplete: () => {
        WhatsTrending.bindEvents();
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
    $('.pulse-button').on('click', (event) => {
      WhatsTrending.unbindEvents();
      console.log('DISCOVER', $(event.currentTarget).data().to, $(event.currentTarget).data().from);
      App.redirectTo(
        `${Config.podURL}${$(event.currentTarget).data().to}/index.html?referrer=${$(event.currentTarget).data().from}`
      );
    });

    $('.back-container > img').on('click', (event) => {
      WhatsTrending.unbindEvents();
      App.redirectTo(`${Config.podURL}/menu-${Config.menuVersion}/index.html`);
    });
  }
}
