 

# function-wrapper

![](https://img.shields.io/badge/function--wrapper-v1.0.0-green.svg) ![](https://img.shields.io/badge/tests-100%25-green.svg) ![](https://img.shields.io/badge/coverage-100%25-green.svg) ![](https://img.shields.io/badge/stable-95%25-green.svg)



Functional wrapper for JavaScript.

This module is a very simple and intuitive function that generates
a function that can surround a function with 2 functions: one
before it, and one after it. This way, the developer can wrap a
function with functions, easily.



## 1. Installation

~$ `npm install --save function-wrapper`

## 2. Usage

#### 1. Get the module.

#### 1.a) Get the module in browser environments:

```js
<script src="node_modules/function-wrapper/src/function-wrapper.js"></script>
```

#### 1.b) Get the module in Node.js environments:

```js
const FunctionWrapper = require("function-wrapper").FunctionWrapper;
```

#### 2. Create a new FunctionWrapper instance:

```js
const consoleLog = console.log;
const funcs = new FunctionWrapper({
 func: console.log, // REQUIRED
 funcScope: console,
 before: function() {
   consoleLog.apply(console, ["[BEFORE]", this()].concat(Array.prototype.slice.call(arguments)));
 },
 beforeScope: Date,
 after: function() {
   consoleLog.apply(console, ["[AFTER]", this()].concat(Array.prototype.slice.call(arguments)));
 },
 afterScope: Date,
 scope: undefined,
 override: false
});
```
#### 3. Change the function by the `~.newFunc` value returned:

```js
console.log = funcs.newFunc;
```

#### 4. Use the altered function normally:

```js
console.log("This is a hooked message");
   // [BEFORE] {{new Date}} This is a hooked message
   // This is a hooked message
   // [BEFORE] {{new Date}} This is a hooked message
```

#### 5. Change the function to its original value saved at the returned `~.oldFunc`:

```js
console.log = funcs.oldFunc;
console.log("This is a normal message again");
   // This is a normal message again
```

Set the `scope` parameter if you want a default scope for the 3 functions (before, wrapped, and after).

Set the `override` to **`true`** if you want to omit the wrapped function call in the `newFunc` resultant function.



## 3. API Reference





 


----

### `require("function-wrapper").FunctionWrapper`


**Type:** `{Class}`

**Parameter:** `{Object:info}`. Object with the data for the function wrapper generated.
It must be an object following the next schema:

```js
{
 func: Function,    // Required
 funcScope: Any,    // Optional
 before: Function,  // Optional
 beforeScope: Any,  // Optional
 after: Function,   // Optional
 afterScope: Any,   // Optional
 scope: Any,        // Optional, default: null
 override: Boolean, // Optional, default: false
}
```

Description of each property:

· **`func`**: `{Function}`. Function to be wrapped.

· **`funcScope`**: `{Any}`. The scope asigned to the function to be wrapped.

· **`before`**: `{Function}`. Function to be called before the wrapped function.

· **`beforeScope`**: `{Any}`. The scope asigned to the function to be wrapped.

· **`after`**: `{Function}`. Function to be called before the wrapped function.

· **`afterScope`**: `{Any}`. The scope asigned to the function to be wrapped.

· **`scope`**: `{Any}`. The scope asigned to the functions, if their specific parameter is not specified.

· **`override`**: `{Boolean}`. Flag to determine if the `newFunc` resultant function should omit (override)
the original function call (**`true`**), or not (**`false`**). By default: **`false`** (so, the original
function will be called).


**Return:** `{Object}`. Returns an object with 2 properties, one for the original function, and another
for the wrapper generated. Like this:

```js
{
 oldFunc: Function,
 newFunc: Function
}
```





 


## 4. Conclusion

This module is about less than 60 lines of effective code (without comments and wrappers).

Basically, a very simple and minimal module to enable functional aspect-oriented programming for JavaScript.





