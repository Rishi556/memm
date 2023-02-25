const test = require("node:test");
const assert = require("node:assert");
const { set, get, remove, setDefaultTTL, getDefaultTTL } = require('./index');

test("Valid Set/Get TTL", (t) => {
  //Ensure that initial TTL is correct
  assert.ok(getDefaultTTL() === Number.MAX_SAFE_INTEGER);

  //Modify TTL
  setDefaultTTL(1);
  assert.ok(getDefaultTTL() === 1);
});

test("Invalid Set TTL", (t) => {
  //Ensure valid starting TTL
  setDefaultTTL(Number.MAX_SAFE_INTEGER);
  assert.ok(getDefaultTTL() === Number.MAX_SAFE_INTEGER);

  //Try to set stirng
  try {
    setDefaultTTL('213');
    assert.fail('Set string TTL');
  } catch (err) {
    assert.ok(err === 'ttl should be a number');
  }
  //Ensure TTL not changed
  assert.ok(getDefaultTTL() === Number.MAX_SAFE_INTEGER);

  //Try to set negative number
  try {
    setDefaultTTL(-1);
    assert.fail('Set negative TTL');
  } catch (err) {
    assert.ok(err === 'ttl should be greator than 0');
  }
  //Ensure TTL not changed
  assert.ok(getDefaultTTL() === Number.MAX_SAFE_INTEGER);

  //Try to set zero
  try {
    setDefaultTTL(0);
    assert.fail('Set zero TTL');
  } catch (err) {
    assert.ok(err === 'ttl should be greator than 0');
  }
  //Ensure TTL not changed
  assert.ok(getDefaultTTL() === Number.MAX_SAFE_INTEGER);

  //Try to above max safe int
  try {
    setDefaultTTL(Number.MAX_SAFE_INTEGER + 1);
    assert.fail('Set above max safe int TTL');
  } catch (err) {
    assert.ok(err === 'ttl should be less than ' + Number.MAX_SAFE_INTEGER);
  }
  //Ensure TTL not changed
  assert.ok(getDefaultTTL() === Number.MAX_SAFE_INTEGER);
});

test('valid set/get', (t) => {
  //string, default ttl
  set('foo', 'bar');
  assert.ok(get('foo') === 'bar');

  //string, 100 ms ttl
  set('foo2', 'bar2', 100);
  assert.ok(get('foo2') === 'bar2');

  //int, 100 ms ttl
  set(1, 'foo', 100);
  assert.ok(get(1) === 'foo');
  assert.ok(get('1') === 'foo');

  //should not be there after 100 ms
  setTimeout(() => {
    assert.ok(get(1) === null);
    assert.ok(get('1') === null);
  }, 101);

  //non existant value should be null
  assert.ok(get(2) === null);
  assert.ok(get('2') === null);
});


test('invalid set/get', (t) => {
  //Ensure foo is clean
  remove('foo');
  assert.ok(get('foo') === null);
  //set not string/int
  try {
    set({}, 'bar');
    assert.fail('Set invalid key');
  } catch (err) {
    assert.ok(err === 'key should be a string or number');
  }

  //get not string/int
  try {
    get({});
    assert.fail('get invalid TTL');
  } catch (err) {
    assert.ok(err === 'key should be a string or number');
  }

  //Try to set stirng
  try {
    set('foo', 'bar', '123');
    assert.fail('Set string TTL');
  } catch (err) {
    assert.ok(err === 'ttl should be a number');
  }
  //Ensure nothing got written to foo
  assert.ok(get('foo') === null);

  //Try to set negative number
  try {
    set('foo', 'bar', -1);
    assert.fail('Set negative TTL');
  } catch (err) {
    assert.ok(err === 'ttl should be greator than 0');
  }
  //Ensure nothing got written to foo
  assert.ok(get('foo') === null);

  //Try to set zero
  try {
    set('foo', 'bar', 0);
    assert.fail('Set zero TTL');
  } catch (err) {
    assert.ok(err === 'ttl should be greator than 0');
  }
  //Ensure nothing got written to foo
  assert.ok(get('foo') === null);

  //Try to above max safe int
  try {
    set('foo', 'bar', Number.MAX_SAFE_INTEGER + 1);
    assert.fail('Set above max safe int TTL');
  } catch (err) {
    assert.ok(err === 'ttl should be less than ' + Number.MAX_SAFE_INTEGER);
  }
  //Ensure nothing got written to foo
  assert.ok(get('foo') === null);
});

test('valid remove', (t) => {
  //existant
  set('foo', 'bar');
  assert.ok(get('foo') === 'bar');
  assert.ok(remove('foo') === 'bar');
  assert.ok(get('foo') === null);

  //nonexistant
  assert.ok(remove('buzz') === null);
  assert.ok(get('buzz') === null);
});

test('invalid remove', (t) => {
  //Try to set zero
  try {
    remove({});
    assert.fail('remove non string/number');
  } catch (err) {
    assert.ok(err === 'key should be a string or number');
  }
});