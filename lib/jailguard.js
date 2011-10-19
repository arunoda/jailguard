var vm = require('vm');
var burrito = require('burrito');
var Timeout = require('./timeout');

exports.create = function(options) {

	return new JailGuard(options);
}

/*
	@param options contains options send to the JailGuard
	currently available options are
		timeout (default to 200)
*/
function JailGuard(options) {
	
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
		
		var error;

		try{

			wrapTheLoops(/while\(.+\).+\{/);
			wrapTheLoops(/for\(.+\).+\{/);
			vm.runInNewContext(code, env);
			callback(error);
		} catch(err) {

			callback(err)
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
	};

}