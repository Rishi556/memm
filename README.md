# memm
 Node.JS In Memory Cache


# Usage

Import:

```js
const memm = require("@rishi556/memm");
```

Set a value:

```js
// Default TTL of MAX_SAFE_INTEGER ms
memm.set('foo', 'bar');

// TTL of 100 ms
memm.set('foo2', 'bar2', 100);
```

Get a value:

```js
memm.get('foo'); //return 'bar'

memm.get('foo2'); // return 'bar2' within 100 ms of set, otherwise null
```

Remove a value:

```js
memm.remove('foo'); //returns 'bar'

// You can remove non existant values too
memm.remove('buzz') //returns null
```

Change the default TTL, not this doesn't affect already saved values:

```js
memm.setDefaultTTL(1000 * 60); // 1 minute, values are in ms
```

Errors will be thrown on invalid attempts
