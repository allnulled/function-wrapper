const { expect } = require("chai");
const { FunctionWrapper, ConsoleManager } = require(__dirname +
	"/../src/function-wrapper.js");

describe("FunctionWrapper class", function() {
	var LogMessages = [];
	var LogFunction = function() {
		LogMessages = LogMessages.concat(Array.prototype.slice.call(arguments));
	};
	var cleanLog = function() {
		LogMessages = [];
	};
	//
	//
	//
	it("can hook a function with 'before' property", function(done) {
		cleanLog();
		const msg = [];
		const funcs = new FunctionWrapper({
			func: LogFunction,
			override: false,
			before: function(a) {
				msg.push(a);
			}
		});
		LogFunction = funcs.newFunc;
		LogFunction("Hello world!");
		expect(msg.length).to.equal(1);
		expect(msg[0]).to.equal("Hello world!");
		LogFunction = funcs.oldFunc;
		LogFunction("Hi!");
		expect(msg.length).to.equal(1);
		expect(LogMessages.length).to.equal(2);
		done();
	});
	//
	//
	//
	it("can hook a function with 'after' property", function(done) {
		cleanLog();
		const msg = [];
		const funcs = new FunctionWrapper({
			func: LogFunction,
			override: false,
			after: function(a) {
				msg.push(a);
			}
		});
		LogFunction = funcs.newFunc;
		LogFunction("Hello world!");
		expect(msg.length).to.equal(1);
		expect(msg[0]).to.equal("Hello world!");
		LogFunction = funcs.oldFunc;
		LogFunction("Hi!");
		expect(msg.length).to.equal(1);
		expect(LogMessages.length).to.equal(2);
		done();
	});
	//
	//
	//
	it("can set the scope of all", function(done) {
		var isExecutedFunction = false;
		var isExecutedBefore = false;
		var isExecutedAfter = false;
		const funcs = new FunctionWrapper({
			func: function() {
				expect(this.n).to.equal(500);
				isExecutedFunction = true;
			},
			before: function() {
				expect(this.n).to.equal(500);
				isExecutedBefore = true;
			},
			after: function() {
				expect(this.n).to.equal(500);
				isExecutedAfter = true;
			},
			scope: { n: 500 }
		});
		funcs.newFunc();
		expect(isExecutedBefore).to.equal(true);
		expect(isExecutedAfter).to.equal(true);
		expect(isExecutedFunction).to.equal(true);
		done();
	});
	//
	//
	//
	it("can set the scope of each", function(done) {
		var isExecutedFunction = false;
		var isExecutedBefore = false;
		var isExecutedAfter = false;
		const funcs = new FunctionWrapper({
			funcScope: { n: 100 },
			func: function() {
				expect(this.n).to.equal(100);
				isExecutedFunction = true;
			},
			beforeScope: { n: 200 },
			before: function() {
				expect(this.n).to.equal(200);
				isExecutedBefore = true;
			},
			afterScope: { n: 300 },
			after: function() {
				expect(this.n).to.equal(300);
				isExecutedAfter = true;
			},
			scope: { n: 500 }
		});
		funcs.newFunc();
		expect(isExecutedBefore).to.equal(true);
		expect(isExecutedAfter).to.equal(true);
		expect(isExecutedFunction).to.equal(true);
		done();
	});
	//
	//
	//
	it("can override the main function, but not by default", function(done) {
		var isExecutedFunction = false;
		var isExecutedBefore = false;
		var isExecutedAfter = false;
		const funcs = new FunctionWrapper({
			funcScope: { n: 100 },
			func: function() {
				expect(this.n).to.equal(100);
				isExecutedFunction = true;
			},
			beforeScope: { n: 200 },
			before: function() {
				expect(this.n).to.equal(200);
				isExecutedBefore = true;
			},
			afterScope: { n: 300 },
			after: function() {
				expect(this.n).to.equal(300);
				isExecutedAfter = true;
			},
			scope: { n: 500 },
			override: true
		});
		funcs.newFunc();
		expect(isExecutedBefore).to.equal(true);
		expect(isExecutedAfter).to.equal(true);
		expect(isExecutedFunction).to.equal(false);
		done();
	});
	//
	//
	//
	it("calls each hook by order and passing the same parameters", function(done) {
		cleanLog();
		var isExecutedBefore = false;
		var isExecutedAfter = false;
		const funcs = new FunctionWrapper({
			func: LogFunction,
			before: function(message, message2) {
				expect(LogMessages.length).to.equal(0);
				expect(message).to.equal("Message 1");
				expect(message2).to.equal("Message 2");
				LogMessages.push(message);
				isExecutedBefore = true;
			},
			after: function(message, message2) {
				expect(LogMessages.length).to.equal(3);
				expect(message).to.equal("Message 1");
				expect(message2).to.equal("Message 2");
				LogMessages.push(message);
				isExecutedAfter = true;
			}
		});
		LogFunction = funcs.newFunc;
		LogFunction("Message 1", "Message 2");
		expect(isExecutedBefore).to.equal(true);
		expect(isExecutedAfter).to.equal(true);
		expect(LogMessages.length).to.equal(4);
		done();
	});
	//
	//
	//
	it("throws error when property 'func' is missing", function(done) {
		try {
			new FunctionWrapper({});
		} catch (exc) {
			expect(exc.name).to.equal("FunctionWrapper:MissingFuncError");
			done();
		}
	});

	/*
	func,
  scope,
  before,
  after,
  beforeScope,
  afterScope,
  funcScope,
  override
	*/
});

describe("ConsoleManager master object", function() {
	it("can save logging, recover logging, know if it is saving the logging, retrieve the logged messages, clear messages, and save logging overriding default behaviour.", function(done) {
		console.log("Message not saved 1");
		expect(ConsoleManager.isSavingLog()).to.equal(false);
		ConsoleManager.saveLog();
		console.log("Message saved 1");
		expect(ConsoleManager.isSavingLog()).to.equal(true);
		console.log("Message saved 2");
		console.log("Message saved 3");
		ConsoleManager.originalLog("Message not saved 2");
		ConsoleManager.recoverLog();
		console.log("Message not saved 4");
		expect(ConsoleManager.messages.length).to.equal(3);
		ConsoleManager.clearMessages();
		expect(ConsoleManager.messages.length).to.equal(0);
		ConsoleManager.saveLog(true);
		console.log("This message should never be seen by console");
		ConsoleManager.recoverLog();
		expect(ConsoleManager.messages.length).to.equal(1);
		expect(ConsoleManager.messages[0]).to.equal(
			"This message should never be seen by console"
		);
		ConsoleManager.clearMessages();
		expect(ConsoleManager.messages.length).to.equal(0);
		done();
	});
});
