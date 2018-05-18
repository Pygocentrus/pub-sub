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

  unsubscribeAll(pattern) {
    if (!pattern) {
      this.listeners = {};
    }

    if (pattern instanceof RegExp) {
      Object.keys(this.listeners).forEach((event) => {
        if (event.match(pattern)) {
          delete this.listeners[event];
        }
      });
    } else if (typeof pattern === 'string' && this.listeners[pattern]) {
      delete this.listeners[pattern];
    }
  }
}

module.exports = new PubSub();
