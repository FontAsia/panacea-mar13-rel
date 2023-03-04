import { Common } from './common.js';
import { Config } from '../config.js';

export class AppState {
  static SESSIONS_COLLECTION = 'sessions-test';
  static DEVICES_COLLECTION = 'devices-test';
  static EVENTS_COLLECTION = 'events-test';

  static YEAR_SUB_COLLECTION = 'year';
  static MONTH_SUB_COLLECTION = 'month';
  static DATE_SUB_COLLECTION = 'date';
  static SESSION_SUB_COLLECTION = 'session';

  static DEVICE_ID_KEY = 'deviceId';
  static SESSION_ID_KEY = 'sessionId';
  static PENDING_SESSION_ID_KEY = 'pendingSessionId';
  static SESSION_TYPE_KEY = 'sessionType';
  static SESSION_START_TIME_KEY = 'sessionStartTime';
  static IDLE_TIMER_ID_KEY = 'idleTimerId';
  static ENGAGEMENT_PAGE_KEY = 'engagementPage';
  static ENGAGEMENT_TIME_KEY = 'engagementTime';

  static setDeviceId(deviceId) {
    window.localStorage.setItem(AppState.DEVICE_ID_KEY, deviceId);

    let lastUpDate = new Date(Common.getTimestampInMilliSeconds());

    if (`${Config.isOnline}`) {
      FIRESTORE.collection(AppState.DEVICES_COLLECTION)
        .doc(AppState.getDeviceId())
        .set(
          {
            lastUpDate: lastUpDate.toLocaleDateString('en-US'),
          },
          { merge: true }
        );
    }
  }

  static getDeviceId() {
    return window.localStorage.getItem(AppState.DEVICE_ID_KEY);
  }

  static prepareSession() {
    let sessionId = Common.createUUID();
    window.localStorage.setItem(AppState.PENDING_SESSION_ID_KEY, sessionId);
    console.log('prepare session ' + sessionId);
  }

  static getPendingSessionId() {
    return window.localStorage.getItem(AppState.PENDING_SESSION_ID_KEY);
  }

  static startSession(sessionType) {
    window.localStorage.setItem(AppState.SESSION_ID_KEY, AppState.getPendingSessionId());
    window.localStorage.setItem(AppState.SESSION_TYPE_KEY, sessionType);
    window.localStorage.setItem(AppState.SESSION_START_TIME_KEY, Common.getTimestampInMilliSeconds());
  }

  static endSession() {
    if (!AppState.inSession()) {
      console.log('no session');
      return;
    }

    if (`${Config.isOnline}`) {
      var sessionStartDate = Common.convertToMoment(AppState.getSessionStartTime());

      FIRESTORE.collection(AppState.SESSIONS_COLLECTION)
        .doc(AppState.getSessionId())
        .set(
          {
            sessionType: AppState.getSessionType(),
            sessionStartTime: AppState.getSessionStartTime(),
            sessionTime: Common.getTimestampInMilliSeconds() - AppState.getSessionStartTime(),
            deviceId: AppState.getDeviceId(),
            sessionYear: sessionStartDate.year(),
            sessionMonth: sessionStartDate.month(),
            sessionDate: sessionStartDate.date(),
          },
          { merge: true }
        );
    }
    window.localStorage.removeItem(AppState.SESSION_TYPE_KEY);
    window.localStorage.removeItem(AppState.SESSION_ID_KEY);
    window.localStorage.removeItem(AppState.SESSION_START_TIME_KEY);
  }

  static getSessionId() {
    return window.localStorage.getItem(AppState.SESSION_ID_KEY);
  }

  static inSession() {
    return AppState.getSessionId() != null;
  }

  static getSessionType() {
    return window.localStorage.getItem(AppState.SESSION_TYPE_KEY);
  }

  static getSessionStartTime() {
    return parseInt(window.localStorage.getItem(AppState.SESSION_START_TIME_KEY));
  }

  static getIdleTimerId() {
    let timerId = window.localStorage.getItem(AppState.IDLE_TIMER_ID_KEY);
    if (timerId == null || timerId == undefined) {
      return null;
    }
    return parseInt(window.localStorage.getItem(AppState.IDLE_TIMER_ID_KEY));
  }

  static setIdleTimerId(timerId) {
    window.localStorage.setItem(AppState.IDLE_TIMER_ID_KEY, timerId);
  }

  static removeIdleTimerId() {
    window.localStorage.removeItem(AppState.IDLE_TIMER_ID_KEY);
  }

  static restartIdleTimer(cbFunc) {
    if (AppState.getIdleTimerId() != null) {
      clearTimeout(AppState.getIdleTimerId());
    }
    AppState.setIdleTimerId(setTimeout(cbFunc, Config.idleTimeout));
  }

  static stopIdleTimer() {
    console.log('stopping idle timer');
    if (AppState.getIdleTimerId() != null) {
      clearTimeout(AppState.getIdleTimerId());
      AppState.removeIdleTimerId();
    }
  }

  static startPageTrack() {
    window.localStorage.setItem(AppState.ENGAGEMENT_TIME_KEY, Common.getTimestampInMilliSeconds());
    window.localStorage.setItem(AppState.ENGAGEMENT_PAGE_KEY, document.title);
    console.log('Start page track');
  }

  static getEngagementTime() {
    return parseInt(window.localStorage.getItem(AppState.ENGAGEMENT_TIME_KEY));
  }

  static getEngagementPage() {
    return window.localStorage.getItem(AppState.ENGAGEMENT_PAGE_KEY);
  }

  static endPageTrack() {
    if (AppState.getEngagementTime() == null || AppState.getEngagementPage() == null) {
      return;
    }

    if (`${Config.isOnline}`) {
      var engagementTime = Common.convertToMoment(AppState.getEngagementTime());

      var pageAttr = AppState.getEngagementPage().split(':');

      let elapsedTime = Common.getTimestampInMilliSeconds() - AppState.getEngagementTime();
      FIRESTORE.collection(AppState.EVENTS_COLLECTION)
        .doc()
        .set(
          {
            type: pageAttr[0],
            page: pageAttr[1],
            eventTime: AppState.getEngagementTime(),
            elapsedTime: elapsedTime,
            deviceId: AppState.getDeviceId(),
            sessionId: AppState.inSession() ? AppState.getSessionId() : '',
            eventYear: engagementTime.year(),
            eventMonth: engagementTime.month(),
            eventDate: engagementTime.date(),
          },
          { merge: true }
        );
    }

    window.localStorage.removeItem(AppState.ENGAGEMENT_TIME_KEY);
    window.localStorage.removeItem(AppState.ENGAGEMENT_PAGE_KEY);

    console.log('End page track');
  }
}
