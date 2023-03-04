import { Common } from '../../scripts/common.js';
import { Config } from '../../config.js';
import { AppState } from '../../scripts/appstate.js';
import { App } from '../../scripts/app.js';

export class MenuV03 {
  static getBarbaTransition() {
    return {
      name: `menu-transition`,
      to: {
        namespace: [`menu`],
      },
      leave(data) {
        console.log(`menu`, `leave`);
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log(`menu`, `once`);
        MenuV03.onceEnterBarbaHook();
      },
      enter(data) {
        console.log(`menu`, `enter`);
        AppState.startPageTrack();
        MenuV03.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log(`menu`, `afterOnce`);
        MenuV03.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log(`menu`, `after`);
        MenuV03.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    document.addEventListener('contextmenu', (event) => event.preventDefault());
    let sessionId = Common.getQueryParameterByName('sessionId');
    let sessionType = Common.getQueryParameterByName('sessionType');
    if (sessionId != null && sessionType != null) {
      AppState.startSession(sessionType);
    }
    gsap.fromTo(`.menu`, { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    document.addEventListener('contextmenu', (event) => event.preventDefault());
    gsap.fromTo(
      `.touchpoint`,
      { autoAlpha: 0, opacity: 0, y: 100 },
      {
        autoAlpha: 1,
        opacity: 1,
        y: 0,
        delay: 0.5,
        stagger: 0.1,
        onComplete: () => {
          MenuV03.bindEvents();
          AppState.restartIdleTimer(() => {
            barba.go(`${Config.podURL}`);
          });
        },
      }
    );

    $('.touchpoint.whats-new').css('background-image', 'url("../resources/menu/whats-new-uv-sunscreen-spf50.png")');
  }

  static unbindEvents() {
    $(`.back-to-home-container > img`).unbind(`click`);
    $(`main > .menu > .touchpoint`).unbind(`click`);
  }

  static bindEvents() {
    $(`.back-to-home-container > img`).on(`click`, (event) => {
      MenuV03.unbindEvents();
      App.redirectTo(`${Config.podURL}`);
    });

    $(`main > .menu > .touchpoint.whats-new`).on(`click`, () => {
      MenuV03.unbindEvents();
      App.redirectTo(`${Config.podURL}/category/whats-new-uv-sunscreen-sfp50/index.html`);
    });

    $(`main > .menu > .touchpoint.whats-trending`).on(`click`, () => {
      MenuV03.unbindEvents();
      App.redirectTo(`${Config.podURL}/category/whats-trending-v03/index.html`);
    });

    $(`main > .menu > .touchpoint.need`).on(`click`, () => {
      MenuV03.unbindEvents();
      App.redirectTo(`${Config.podURL}/category/shop-by-need-v03/index.html`);
    });

    $(`main > .menu > .touchpoint.range`).on(`click`, () => {
      MenuV03.unbindEvents();
      App.redirectTo(`${Config.podURL}/category/shop-by-range-v03/index.html`);
    });

    $(`main > .menu > .touchpoint.format`).on(`click`, () => {
      MenuV03.unbindEvents();
      App.redirectTo(`${Config.podURL}/category/shop-by-format-v03/index.html`);
    });
  }
}
