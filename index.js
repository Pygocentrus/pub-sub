const crcEncode = require('./lib/crc');

class PubSub {
  constructor() {
    this.listeners = {};
  }

  publish(event, ...payload) {
    if (!event) throw new Error('No event given');
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => listener.handler.call(this, ...payload));
  }

  subscribe(event, handler) {
    if (!event || typeof handler !== 'function') throw new Error('No event or handler given');
    const eventListeners = this.listeners[event] || [];
    const token = crcEncode(handler.toString());
    const eventAlreadySubscribed = eventListeners.find(listener => listener.token === token);
    if (eventAlreadySubscribed) {
      return eventAlreadySubscribed.token;
    }
    this.listeners[event] = [].concat(eventListeners, { token, handler });
    return token;
  }

  unsubscribe(event, token) {
    if (!event || !token) return;
    const eventListeners = this.listeners[event] || [];
    this.listeners[event] = eventListeners.filter(listener => listener.token !== token);
    if (this.listeners[event].length === 0) {
      delete this.listeners[event];
    }
  }

  unsubscribeAll() {
    this.listeners = {};
  }
}

module.exports = new PubSub();
