import test from 'ava';
import sinon from 'sinon';

import pubSub from '..';
import crcEncode from '../lib/crc';

const noop = () => ({});
const getListener = callback => ({ token: crcEncode(callback.toString()), handler: callback });

test.beforeEach(() => {
  pubSub.unsubscribeAll();
});

test('should publish/subscribe an event', t => {
  const spy = sinon.spy();
  pubSub.subscribe('foo', spy);
  pubSub.publish('foo');
	t.true(spy.calledOnce);
});

test.cb('should publish a valid payload', t => {
  const payload = { bar: 'baz' };

  pubSub.subscribe('foo', (data) => {
    t.deepEqual(data, payload);
    t.pass();
    t.end();
  });
  pubSub.publish('foo', payload);
});

test('should not fire other event listeners', t => {
  const spy = sinon.spy();
  pubSub.subscribe('foo', spy);
  pubSub.publish('bar');
	t.true(spy.notCalled);
});

test('should store unique listeners per event', t => {
  const event = 'foo';
  const expectedListener = getListener(noop);
  pubSub.subscribe(event, noop);
  t.deepEqual(pubSub.listeners, { [event]: [expectedListener] });
});

test('should not store same listeners twice', t => {
  const event = 'foo';
  pubSub.subscribe(event, noop);
  pubSub.subscribe(event, noop);
  t.is(pubSub.listeners[event].length, 1);
});

test('should throw an error when we publish garbage', t => {
  t.throws(() => pubSub.publish(undefined));
  t.throws(() => pubSub.publish(null));
  t.throws(() => pubSub.publish());
});

test('should throw an error when we subscribe to garbage', t => {
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
