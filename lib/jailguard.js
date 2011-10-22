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
	var child = fork(path.resolve(__dirname, './guard.js'));
	var refs = {};

	console.info('forking child with child options: ' + JSON.stringify(options));
	child.send({
		type: 'create',
		options: options
	});

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

	child.on('message', function(msg) {
		
		if(msg && msg.type == 'run') {
			
			var ref = refs[msg.id];

			//updaing new values over the last one
			for(var key in msg.env) {
				ref.env[key] = msg.env[key];	
			}

			//do the callback
			ref.callback(ref.error);

			//clean the memory
			delete refs[msg.id];
		} else {
			logger.warn('invalid message type: ' + JSON.stringify(msg));
		}
	});
}