const cache = {};

let defaultTTL = Number.MAX_SAFE_INTEGER;

/**
 * Sets a key to a value with ttl
 * @param {String|Number} key key to save
 * @param {*} value value to save
 * @param {*} ttl TTL, default is defaultTTL
 */
function set(key, value, ttl = defaultTTL) {
  validateTTL(ttl);
  validateKey(key);
  const expireAt = Date.now() + ttl;
  cache[key.toString()] = { value, expireAt }
}

/**
 * Gets the value of a key or null if empty
 * @param {String|Number} key key to get value of
 * @returns value or null if nothing there or if expired
 */
function get(key) {
  validateKey(key);
  if (cache.hasOwnProperty(key)) {
    const value = cache[key.toString()];
    if (value.expireAt < Date.now()) {
      return null;
    } else {
      return value.value;
    }
  } else {
    return null;
  }
}

/**
 * Removes and returns a key
 * @param {String} key Key
 * @returns value or null if nothing
 */
function remove(key) {
  validateKey(key);
  let value = null;
  if (cache.hasOwnProperty(key.toString())) {
    value = cache[key].value;
    delete cache[key];
  }
  return value;
}

/**
 * Sets the default ttl in ms
 * @param {Number} ttl Integer ms of ttl
 */
function setDefaultTTL(ttl) {
  validateTTL(ttl);
  defaultTTL = parseInt(ttl);
}

/**
 * Internally validates ttl
 * @param {Number} ttl ttl to validate
 */
function validateTTL(ttl){
  if (typeof ttl !== 'number') {
    throw 'ttl should be a number';
  }
  if (parseInt(ttl) <= 0) {
    throw 'ttl should be greator than 0';
  }
  if (parseInt(ttl) > Number.MAX_SAFE_INTEGER){
    throw 'ttl should be less than ' + Number.MAX_SAFE_INTEGER;
  }
}

/**
 * Internally validates key
 * @param {String|Integer} key key to validate
 */
function validateKey(key){
  if (typeof key !== 'string' && typeof key !== 'number') {
    throw 'key should be a string or number';
  }
}

/**
 * Returns default TTL
 * @returns Default TTL
 */
function getDefaultTTL() {
  return defaultTTL;
}

module.exports = {
  set,
  get,
  remove,
  setDefaultTTL,
  getDefaultTTL
}