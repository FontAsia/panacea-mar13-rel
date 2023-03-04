import { Common } from './common.js';
import { Config } from '../config.js';
import { AppState } from './appstate.js';

export class Menu {
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
        Menu.onceEnterBarbaHook();
      },
      enter(data) {
        console.log(`menu`, `enter`);
        AppState.startPageTrack();
        Menu.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log(`menu`, `afterOnce`);
        Menu.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log(`menu`, `after`);
        Menu.afterOnceEnterBarbaHook();
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
          MenuImpl.getInstance().bindEvents();
          AppState.restartIdleTimer(() => {
            barba.go(`${Config.podURL}`);
          });
        },
      }
    );

    MenuImpl.getInstance().afterOnceEnterBarbaHook();
  }
}
