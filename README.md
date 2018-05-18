# Pub-sub

[![Build Status](https://travis-ci.org/Pygocentrus/pub-sub.svg?branch=master)](https://travis-ci.org/Pygocentrus/pub-sub/jobs/379801952)
![license](https://img.shields.io/github/license/Pygocentrus/pub-sub.svg)

Dependency-free ES6+ Pub-Sub library.

## Basic usage

```javascript
import pubSub from 'pub-sub';

const token = pubSub.subscribe('foo', (data) => console.log(`foo called with ${data.bar}`));

pubSub.publish('foo', { bar: 'baz' });
// output: "foo called with baz"

pubSub.unsubscribe(token);

pubSub.publish('foo', { bar: 'baz' });
// output: undefined
```

## API

### publish

**Signature**: `string`, [...`any`] => `void`

This function takes a token and unsubscribes the underlying listener.

```javascript
pubSub.publish('foo');
pubSub.publish('bar', 1337);
pubSub.publish('baz', { a: 'b', c: 1 });
pubSub.publish('args', 1, 2, 3);
```

### subscribe

**Signature**: `string`, `func` => `string`

This function creates a listener for an event/thread given a callback, and sends back a token that may be used to unsubscribe later.

```javascript
// If you need to unsubscribe later, store the token
const token = pubSub.subscribe('event', handler);

// Otherwise, the syntax is simpler
pubSub.subscribe('phone:call', hangUp);
```

### unsubscribe

**Signature**: `string` => `void`

This function takes a token and unsubscribes the underlying listener.

```javascript
pubSub.unsubscribe(token);
```

### unsubscribeAll

**Signature**: `void` | `string` | `regex` => `void`

This function unsubscribes every listeners.

```javascript
// Unsubscribes all listeners of a matching thread
pubSub.unsubscribeAll('foo');
pubSub.unsubscribeAll(/foo:.*/);

// Unsubscribe all events
pubSub.unsubscribeAll();
```
