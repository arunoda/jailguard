/**
	Execution Engine Based on Safe JavaScript Engine
	Track Never ending loops
	Avoid setTimeout, setInterval and eval

	** This execute in the same process **
*/

var vm = require('vm');
var Timeout = require('./timeout');

exports.create = function(options) {

	return new Jail(options);
}

/*
	@param options contains options send to the JailGuard
	currently available options are
		timeout (default to 200)
*/
function Jail(options) {
	
	//set dafault values
	options = (options)? options: {timeout: 200};
	options.timeout = (options.timeout)? options.timeout: 200;

	/**
		Run Javascripts in a secure way

		@param code - Javascript code block
		@param env - Enviroment Where you can set globals
		@param callback - will be called after successful execution or occurs an error
			function(err)
	*/
	this.run = function(code, env, callback) {
		

		env = (env)? env: {};
		env['eval'] = stopExecuting('eval');
		env['setTimeout'] = stopExecuting('setTimeout');
		env['setInterval'] = stopExecuting('setInterval');
		env['Function'] = getBlockedFunctionConstructor();


		var error;

		try{

			wrapTheLoops(/while\(.+\).+\{/);
			wrapTheLoops(/for\(.+\).+\{/);
			vm.runInNewContext(code, env);
			callback(error);
		} catch(err) {

			callback(err);
		}

		function wrapTheLoops(regex) {
			
			var timeoutCount = 0;
			var whiles = code.match(regex);
			
			if(whiles) {
				
				whiles.forEach(function(block) {
					
					timeoutCount++;
					
					var replacement = block + ' if(_timeout' + timeoutCount + '.exceeded()) {break;} '
					code = code.replace(block, replacement);

					var t = new Timeout(options.timeout);
					t.onTimeout(function() {
						error = {code: 'NEVER_ENDING_LOOP'};
					});
					env['_timeout' + timeoutCount] = t;
				});
			}

		}

		/**
			This will prevent 
		*/
		function stopExecuting(method) {
			
			return function() {
				var code = method.toUpperCase() + '_NOT_SUPPORTED';
				error = {code: code, message: code};
			}
		}

		/**
			This will blocks the usage of Function Construction
		*/
		function getBlockedFunctionConstructor() {
			
			function FakeFunction(execCode) {
				var code = "FUNCTION_CONSTRUCTOR_DETECTED";
				var message = "function constructor with code: " + execCode;
				error = {code: code, message: message};

				return function() {};
			}

			return FakeFunction;
		}

	};

}