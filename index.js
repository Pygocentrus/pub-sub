const idGenerator = require('./lib/id-generator');

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
    const token = idGenerator.next().value;
    this.listeners[event] = [].concat(eventListeners, { token, handler });
    return token;
  }

  unsubscribe(token) {
    if (!token) return;

    Object.keys(this.listeners).forEach((event) => {
      const eventListeners = this.listeners[event];
      if (eventListeners && eventListeners.length) {
        // Filter out listeners that match the token
        this.listeners[event] = eventListeners.filter(listener => listener.token !== token);

        // If no listeners anymore, remove event
        if (this.listeners[event].length === 0) {
          delete this.listeners[event];
        }
      }
    });
  }

  unsubscribeAll() {
    this.listeners = {};
  }
}

module.exports = new PubSub();
