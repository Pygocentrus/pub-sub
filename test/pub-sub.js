import test from 'ava';
import sinon from 'sinon';

import pubSub from '..';
import crcEncode from '../lib/crc';

const noop = () => ({});
const getListener = callback => ({ token: crcEncode(callback.toString()), handler: callback });

test.beforeEach(() => {
  pubSub.unsubscribeAll();
});

test('should publish event', t => {
  const spy = sinon.spy();
  pubSub.subscribe('foo', spy);
  pubSub.publish('foo');
	t.true(spy.calledOnce);
});

test('should store unique listeners per event', t => {
  const event = 'foo';
  const expectedListener = getListener(noop);
  pubSub.subscribe(event, noop);
  t.deepEqual(pubSub.listeners, { [event]: [expectedListener] });
});

test('should throw error when subscribe signature does not match', t => {
  t.throws(() => pubSub.subscribe('foo'));
  t.throws(() => pubSub.subscribe(null));
  t.throws(() => pubSub.subscribe());
});

test('should be able to unsubscribe an event', t => {
  const event = 'foo';
  const expectedListener = getListener(noop);
  const token = pubSub.subscribe(event, noop);

  t.is(Object.keys(pubSub.listeners).length, 1);
  t.deepEqual(pubSub.listeners[event], [expectedListener]);

  pubSub.unsubscribe(event, token);

  t.is(Object.keys(pubSub.listeners).length, 0);
  t.deepEqual(pubSub.listeners[event], undefined);
});
