/**
	Jail Guard with NodeJs forking with using seperate processes to execute JS

	@param options contains options send to the JailGuard
	currently available options are
		timeout (default to 200)
*/

var fork = require('node-fork');
var path = require('path');

exports.create = function(options) {
	
	return new JailGuard(options);
};

function JailGuard(options) {
	
	var runCount = 0;
	var refs = {};
	var child = createNewChild();
	this._child = child;

	/**
		Run Javascripts in a secure way

		@param code - Javascript code block
		@param env - Enviroment Where you can set globals
		@param callback - will be called after successful execution or occurs an error
			function(err)
	*/
	this.run = function(code, env, callback) {
		var id = ++runCount;

		child.send({
			type: 'run',
			id: id,
			code: code,
			env: env	
		});

		refs[id] = {
			callback: callback,
			env: env
		};
	};

	//handle when a message recieve for the child
	function onMessage(msg) {
		
		if(msg && msg.type == 'run') {
			
			var ref = refs[msg.id];

			//updaing new values over the last one
			for(var key in msg.env) {
				ref.env[key] = msg.env[key];	
			}

			//do the callback
			process.nextTick(function() {
				
				ref.callback(msg.error);
				//clean the memory
				delete refs[msg.id];
			});

		} else {
			logger.warn('invalid message type: ' + JSON.stringify(msg));
		}
	}

	//add new Child on Exit
	function onExit(code, signal) {
		
		console.info('creating new child due to termination as code: ' + code + ' signal: ' + signal);
		process.nextTick(function() {
			child = createNewChild();
		});
	}

	function createNewChild() {
		
		var child = fork(path.resolve(__dirname, './guard.js'));
		
		//remove existing ref (way of cleaning memeory leak)
		for(var key in refs) {
			ref = refs[key];
			ref.callback({code: 'CHILD_KILLED', message: 'child processer get killed'});
		}
		refs = {};

		console.info('forking child with child options: ' + JSON.stringify(options));
		child.send({
			type: 'create',
			options: options
		});

		child.on('message', onMessage);
		child.on('exit', onExit);

		return child;
	}
}