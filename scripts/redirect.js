import { Common } from './common.js';
import { Preload } from './preload.js';

export class Redirect {
  static getBarbaTransition() {
    return {
      name: 'redirect-transition',
      to: {
        namespace: ['redirect'],
      },
      leave(data) {
        console.log('redirect', 'leave');
        return Common.pageTransition();
      },
      once(data) {
        Redirect.preload();
        console.log('redirect', 'once');
      },
      enter(data) {
        console.log('home', 'enter');
      },
      afterOnce(data) {
        console.log('home', 'afterOnce');
      },
      after(data) {
        console.log('home', 'after');
      },
    };
  }

  static preload() {
    console.log('preloading');
    Preload.load(
      async () => {
        let deviceId = Common.getQueryParameterByName('deviceId');
        console.log('loaded');
        barba.go(`/?deviceId=${deviceId}`);
      },
      (percent) => {
        gsap.to('.redirect > .loader > img', { autoAlpha: percent, opacity: percent, duration: 0.1 });
        $('.redirect > .loader > p').text(Math.floor(percent * 100) + '%');
      }
    );
  }
}
