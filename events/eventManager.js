export class ScheduledEvent {
  locked = false;
  lockReleaseAt = 0;
  /**
   *
   * @param {{
   *  day: number,
   *  hour: number,
   *  minute: number
   *  callback: () => void,
   *  refreshTimeInMinutes: number,
   * }} param0
   */
  constructor({
    day = undefined,
    hour = undefined,
    minute = undefined,
    callback,
    refreshTimeInMinutes,
    lockReleaseAt = 0,
    locked = false
  }) {
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.callback = callback;
    this.refreshTimeInMinutes = refreshTimeInMinutes;
    this.locked = locked;
    this.lockReleaseAt = lockReleaseAt;
  }

  getData() {
    return {
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      callback: this.callback,
      refreshTimeInMinutes: this.refreshTimeInMinutes,
      locked: this.locked,
      lockReleaseAt: this.lockReleaseAt,
    };
  }
}

export class EventManager {
  /**
   * @type {Array<ScheduledEvent>}
   */
  #events = [];

  constructor() {
    this.#runLoop();
  }

  #runLoop() {
    setInterval(() => {
      const now = new Date();
      this.#events
        .map((event) => {
          if (!event.locked) return event;
          
          const ev = new ScheduledEvent(event.getData());
          //if the lock time is smaller then current time, set lock to false
          if (event.lockReleaseAt < Date.now()) ev.locked = false;

          return ev;
        })
        .filter(
          (event) =>
            (event.day != undefined ? now.getDate() == event.day : true) &&
            (event.hour != undefined ? now.getHours() == event.hour : true) &&
            (event.minute != undefined
              ? now.getMinutes() == event.minute
              : true ) &&
            event.locked == false
        )
        .map((event) => {
          event.locked = true;
          event.lockReleaseAt =
            Date.now() + event.refreshTimeInMinutes * 60 * 1000;
          event.callback.call();
        });
    }, 1000 * 5);
  }

  /**
   *
   * @param {ScheduledEvent} event
   */
  insertEvent(event) {
    this.#events.push(event);
  }
}
