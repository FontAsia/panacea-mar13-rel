export class Common {
  static pageTransition() {
    let tl = gsap.timeline();

    tl.set('.loading-screen', { height: '100%', top: '0%' })
      .fromTo('.loading-screen', { autoAlpha: 0, opacity: 0 }, { autoAlpha: 1, opacity: 1, duration: 0.1 })
      .to('.loading-screen', { duration: 0.8, height: '100%', top: '-100%', ease: 'Expo.easeInOut', delay: 0.1 })
      .set('.loading-screen', { top: '100%' });
  }

  static homeAnimation() {
    let t1 = gsap.timeline({ duration: 0.3 });

    t1.from('.home-section', { autoAlpha: 0, opacity: 1 })
      //.from(".home-section > .background", { autoAlpha: 0, opacity: 1 } )
      //.from(".home-section > .product-shot", { autoAlpha: 0, opacity: 1, y: 100 }, "-=0.3" )
      .from('.product > .product-name-container', { autoAlpha: 0, opacity: 1, x: -100 }, '-=0.3')
      // .from(".product > .logo", { autoAlpha: 0, opacity: 1, x: 100 }, "-=0.3")
      .from('.product > .navigation', { autoAlpha: 0, opacity: 1, x: '-100%' }, '-=0.4')
      .from('.product > .close-button', { autoAlpha: 0, opacity: 1, x: '100%' }, '-=0.4');
  }

  static getQueryParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  static createUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  static getTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  static getTimestampInMilliSeconds() {
    return Date.now();
  }

  static convertToMoment(timestampInMilliseconds) {
    return moment(timestampInMilliseconds);
  }
}
