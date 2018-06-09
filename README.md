 

# function-wrapper

![](https://img.shields.io/badge/function--wrapper-v1.1.0-green.svg) ![](https://img.shields.io/badge/tests-100%25-green.svg) ![](https://img.shields.io/badge/coverage-100%25-green.svg) ![](https://img.shields.io/badge/stable-95%25-green.svg)



Functional wrapper for JavaScript.

This module is a very simple and intuitive function that generates
a function that can surround a function with 2 functions: one
before it, and one after it. This way, the developer can wrap a
function with functions, easily.

As the main goal of this module was to wrap the `console.log` function
in order to register the messages passed to it, this module also comes
bundled with a simple utility to register the logs made by `console.log`
in a comfortable way.

To start saving the messages (into `ConsoleManager.messages`), you can
simply do `ConsoleManager.saveLog()`. To come back to the default behaviour
you can simply do `ConsoleManager.recoverLog()`, and `console.log` will
stop registering the messages that it receives. There are some more options
too, like to stop logging by console the messages while saving them, to clear
the messages, to log messages independently of the current `console.log`
behaviour, or to know if the behaviour of `console.log` was the same as it
was at the begining or if it has been altered.

## 1. Installation

~$ `npm install --save function-wrapper`

## 2. Usage

This module is divided in 2 onthologies:

**A:** `FunctionWrapper` class.

**B:** `ConsoleManager` object.

Both are provided as Node.js module or browser global variables.


### A. Usage of the `FunctionWrapper` class.

#### 1. Get the module.

#### 1.a) Get the module in browser environments:

```js
<script src="node_modules/function-wrapper/src/function-wrapper.js"></script>
<script>
const FunctionWrapper = FunctionWrapperAPI.FunctionWrapper;
</script>
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

----

### B. Usage of the `ConsoleManager` class.

#### 1. Get the module.

#### 1.a) Get the module in browser environments:

```js
<script src="node_modules/function-wrapper/src/function-wrapper.js"></script>
<script>
const ConsoleManager = FunctionWrapperAPI.ConsoleManager;
</script>
```

#### 1.b) Get the module in Node.js environments:

```js
const ConsoleManager = require("function-wrapper").ConsoleManager;
```

#### 2. Start saving logged messages.

The following demonstration uses the [Chai](https://github.com/chaijs/chai) syntax, as the tests are done
with mocha and chai.

```js
console.log("Message not saved 1");
// expect(ConsoleManager.isSavingLog()).to.equal(false);
ConsoleManager.saveLog();
console.log("Message saved 1");
// expect(ConsoleManager.isSavingLog()).to.equal(true);
console.log("Message saved 2");
console.log("Message saved 3");
ConsoleManager.originalLog("Message not saved 2");
ConsoleManager.recoverLog();
console.log("Message not saved 4");
// expect(ConsoleManager.messages.length).to.equal(3);
ConsoleManager.clearMessages();
// expect(ConsoleManager.messages.length).to.equal(0);
ConsoleManager.saveLog(true);
console.log("This message should never be seen by console");
ConsoleManager.recoverLog();
// expect(ConsoleManager.messages.length).to.equal(1);
// expect(ConsoleManager.messages[0]).to.equal("This message should never be seen by console");
ConsoleManager.clearMessages();
// expect(ConsoleManager.messages.length).to.equal(0);
```

This is a demonstration of the whole `ConsoleManager` API.

But the core idea is simple.

Call `ConsoleManager.saveLog()` to start registering the `console.log(...)` messages into `ConsoleManager.messages` array.

Pass a `true` to `ConsoleManager.saveLog(true)` if you want to hide by console the messages logged while the log is saved.

Call `ConsoleManager.recoverLog()` to stop saving the logged messages by `console.log`.

Call `ConsoleManager.isSavingLog()` to know if the `console.log` is having the default behaviour.

Call `ConsoleManager.originalLog(...)` to use the original `console.log(...)`, independently of its current behaviour.

Use `ConsoleManager.messages` to see the currently saved messages.

Call `ConsoleManager.clearMessages()` to reset the saved messages.

And that is all.




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

· **`funcScope`**: `{Any}`. The scope assigned to the function to be wrapped.

· **`before`**: `{Function}`. Function to be called before the wrapped function.

· **`beforeScope`**: `{Any}`. The scope assigned to the function to be called before the original function.

· **`after`**: `{Function}`. Function to be called after the wrapped function.

· **`afterScope`**: `{Any}`. The scope assigned to the function to be called after the original function.

· **`scope`**: `{Any}`. The scope assigned to the functions, if their specific parameter is not specified.

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





 


----

### `require("function-wrapper").ConsoleManager`


**Type:** `{Object}`


**Description:** Utility to save the console messages in a fast and reliable way.
As it was the main purpose of this library, the utility is included directly
with it.






 


----

### `ConsoleManager.messages`


**Type:** `{Array}`


**Description:** Array that saves the logged messages (when the messages
are being logged.


**Usage:** The usage of this object is very simple.

```js
console.log("Message not saved 1");
console.log(ConsoleManager.isSavingLog()); // >> false
ConsoleManager.saveLog();
console.log("Message saved 1");
console.log(ConsoleManager.isSavingLog()); // >> true
console.log("Message saved 3");
console.log("Message saved 4");
ConsoleManager.originalLog("Message not saved 3");
ConsoleManager.recoverLog();
console.log("Message not saved 4");
console.log(ConsoleManager.messages.length === 4); // >> true
ConsoleManager.clearMessages();
console.log(ConsoleManager.messages.length === 0); // >> true
```




 


----

### `ConsoleManager.clearMessages()`


**Type:** `{Function}`


**Description:** Clears the stack of messages already saved.


**Returns:** `{void}`




 


----

### `ConsoleManager.originalLog(Any...)`


**Type:** `{Function}`


**Description:** The classical `console.log` function is saved here, so you can substitute
the `console.log(...)` usage by `ConsoleManager.originalLog(...)` whenever you need to
log something by console, independently of the current `console.log(...)` behaviour.


**Returns:** `{void}`




 


----

### `ConsoleManager.saveLog(Boolean:overrideOriginal)`


**Type:** `{Function}`


**Parameter:** `{Boolean} overrideOriginal`. If `true`, it will override the default behaviour of
`console.log`, and it will hide the logs from console when logs are being saved. Otherwise,
the default behaviour is kept, and the messages are logged as always, but the messages will
be also saved int `ConsoleManager.messages`.


**Description:** Starts saving all the messages passed to `console.log` into `ConsoleManager.messages`.


**Returns:** `{void}`





 

----

### `ConsoleManager.recoverLog()`


**Type:** `{Function}`


**Description:** Stops saving all the messages passed to `console.log` into `ConsoleManager.messages`,
and returns the original behaviour to `console.log` method.


**Returns:** `{void}`









 


### `ConsoleManager.isSavingLog()`


**Type:** `{Function}`


**Description:** Returns `true` if the `console.log` method is the same as the begining, when the
module was loaded.


**Returns:** `{Boolean}`









 


## 4. Conclusion

This module is about less than 60 lines of effective code (without comments and wrappers).

Basically, a very simple and minimal module to enable functional aspect-oriented programming for JavaScript.





