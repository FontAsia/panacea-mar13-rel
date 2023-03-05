import { Common } from './common.js';
import { Config } from '../config.js';
import { App } from './app.js';
import { AppState } from './appstate.js';

export class Category {
  static getBarbaTransition() {
    return {
      name: `category-transition`,
      to: {
        namespace: [`category`],
      },
      leave(data) {
        console.log('category', `leave`);
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log('category', `once`);
        Category.onceEnterBarbaHook();
      },
      enter(data) {
        console.log('category', `enter`);
        AppState.startPageTrack();
        Category.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log('category', `afterOnce`);
        Category.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log('category', `after`);
        Category.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    gsap.fromTo(`.category`, { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    let tl = gsap.timeline({
      duration: 0.5,
      onComplete: () => {
        Category.bindEvents();
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
    let referrer = Common.getQueryParameterByName('referrer');

    $(`.back-to-home-container > img`).on(`click`, (event) => {
      $(`.back-to-home-container > img`).unbind(`click`);
      App.redirectTo(`${Config.podURL}/menu/index.html`);
    });

    $(`main > .category > .touchpoint`).on(`click`, (event) => {
      $(`main > .category > .touchpoint`).unbind(`click`);
      console.log('Category', $(event.currentTarget).data().category, $(event.currentTarget).data().to);
      let redirectTo = `${$('.category').data().category}${$(event.currentTarget).data().to}`;
      App.redirectTo(`${Config.podURL}${redirectTo}/index.html`);
    });
  }
}
