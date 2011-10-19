module.exports = Timeout;

function Timeout(timeoutMillies) {

	var callbacks = [];
	var started;

	/**
		check for whether timeout happened or not
		all of the arguments passed to the system method will be passed to the callback
	*/
	this.exceeded = function() {
		
		//if not started start now
		if(!started) {
			
			started = new Date().getTime();
			return false;
		} else {

			var now = new Date().getTime();
			var timeoutExceeded =  (now-started >= timeoutMillies);
			if(timeoutExceeded) {

				for(var index in callbacks) {
					var callback = callbacks[index];
					callback.apply(this, arguments);
				}
				return true;
			} else {

				return false;
			}
		}

	};


	this.onTimeout = function(callback) {
		callbacks.push(callback);
	};
}