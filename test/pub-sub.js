import test from 'ava';
import sinon from 'sinon';
import pubSub from '..';

const noop = () => ({});

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

test('should be able to unsubscribe a single event from token', t => {
  const event = 'foo';
  const token = pubSub.subscribe(event, noop);

  t.is(Object.keys(pubSub.listeners).length, 1);

  pubSub.unsubscribe(token);

  t.is(Object.keys(pubSub.listeners).length, 0);
  t.deepEqual(pubSub.listeners[event], undefined);
});

test('should be able to unsubscribe given a string pattern', t => {
  pubSub.subscribe('foo', () => { console.log('foo 1'); });
  pubSub.subscribe('foo', () => { console.log('foo 2'); });
  pubSub.subscribe('bar', noop);

  t.is(pubSub.listeners['foo'].length, 2);
  t.is(pubSub.listeners['bar'].length, 1);

  pubSub.unsubscribeAll('foo');

  t.is(pubSub.listeners['foo'], undefined);
  t.is(pubSub.listeners['bar'].length, 1);
});

test('should be able to unsubscribe given a regex pattern', t => {
  pubSub.subscribe('foo:match_1', () => { console.log('foo 1'); });
  pubSub.subscribe('foo:match_2', () => { console.log('foo 2'); });
  pubSub.subscribe('faa:not_matched', noop);

  t.is(pubSub.listeners['foo:match_1'].length, 1);
  t.is(pubSub.listeners['foo:match_2'].length, 1);
  t.is(pubSub.listeners['faa:not_matched'].length, 1);

  pubSub.unsubscribeAll(/foo:/);

  t.is(pubSub.listeners['foo:match_1'], undefined);
  t.is(pubSub.listeners['foo:match_2'], undefined);
  t.is(pubSub.listeners['faa:not_matched'].length, 1);
});

test('should be able to unsubscribe all events', t => {
  pubSub.subscribe('foo', noop);
  pubSub.subscribe('bar', noop);
  pubSub.subscribe('baz', noop);

  t.is(Object.keys(pubSub.listeners).length, 3);
  t.is(pubSub.listeners['foo'].length, 1);
  t.is(pubSub.listeners['bar'].length, 1);
  t.is(pubSub.listeners['baz'].length, 1);

  pubSub.unsubscribeAll();

  t.is(Object.keys(pubSub.listeners).length, 0);
  t.is(pubSub.listeners['foo'], undefined);
  t.is(pubSub.listeners['bar'], undefined);
  t.is(pubSub.listeners['baz'], undefined);
});
