import { Common } from './common.js';
import { Config } from '../config.js';
import { Preload } from './preload.js';
import { AppState } from './appstate.js';

export class Home {
  static getBarbaTransition() {
    return {
      name: 'home-transition',
      to: {
        namespace: ['home'],
      },
      leave(data) {
        console.log('home', 'leave');
        AppState.endPageTrack();
        return Common.pageTransition();
      },
      once(data) {
        console.log('home', 'once');
        // Home.preload();
        Home.onceEnterBarbaHook();
      },
      enter(data) {
        console.log('home', 'enter');
        AppState.startPageTrack();
        // $('.loader').hide();
        Home.onceEnterBarbaHook();
      },
      afterOnce(data) {
        console.log('home', 'afterOnce');
        AppState.startPageTrack();
        Home.afterOnceEnterBarbaHook();
      },
      after(data) {
        console.log('home', 'after');
        Home.afterOnceEnterBarbaHook();
      },
    };
  }

  static onceEnterBarbaHook() {
    gsap.fromTo('.home', { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, delay: 0.5 });
  }

  static afterOnceEnterBarbaHook() {
    AppState.prepareSession();
    if (Config.isOnline) {
      Home.createQrCode();
    }
    Home.bindEvents();
    AppState.stopIdleTimer();
    AppState.endSession();
  }

  static createQrCode() {
    new QRCode('qr-code', {
      text: `${
        Config.mobileURL
      }/redirect.html?deviceId=${AppState.getDeviceId()}&sessionId=${AppState.getPendingSessionId()}`,
      // text: `https://www.beautyhub.ph/ponds/`,
      width: 200,
      height: 200,
      // colorDark: '#e75480',
      colorDark: '#000000',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.L,
    });
  }

  static bindEvents() {
    $('.start-here-btn').on('click', () => {
      $('.start-here-btn').unbind('click');
      barba.go(
        `${
          Config.podURL
        }/menu/index.html?sessionId=${Common.createUUID()}&sessionId=${AppState.getPendingSessionId()}&sessionType=on-display`
      );
    });
  }

  static preload() {
    console.log('preloading');
    Preload.load(
      async () => {
        console.log('loaded');
        gsap.to('.home > .loader', { autoAlpha: 0, opacity: 0, duration: 0.3 });
      },
      (percent) => {
        gsap.to('.home > .loader > img', { autoAlpha: percent, opacity: percent, duration: 0.1 });
        $('.home > .loader > p').text(Math.floor(percent * 100) + '%');
      }
    );
  }
}
