# Pub-sub

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

This function takes a token and unscubscribes the underlying listener.

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
// If you need to unscubscribe later, store the token
const token = pubSub.subscribe('event', handler);

// Otherwise, the syntax is simpler
pubSub.subscribe('phone:call', hangUp);
```

### unsubscribe

**Signature**: `string` => `void`

This function takes a token and unscubscribes the underlying listener.

```javascript
pubSub.unsubscribe(token);
```

### unsubscribeAll

**Signature**: `void` => `void`

This function unsubscribes every listeners.

```javascript
pubSub.unsubscribeAll('foo');
```
