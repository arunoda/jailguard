var Timeout = require('timeout');

exports.checkTimeoutExceeded = function(test) {
	
	test.expect(3);

	var t = new Timeout(100);
	t.onTimeout(function(a, b) {
		test.equal(10, a);
		test.equal(20, b);
	});

	var start = new Date().getTime();
	while(true) {
		if(t.exceeded(10, 20)) break;
	}
	var end = new Date().getTime();

	test.equal(100, end-start);
	test.done();
};

exports.checkTimeoutNotExceeded = function(test) {
	
	test.expect(1);
	
	var t = new Timeout(100);
	t.onTimeout(function(a, b) {
		test.fail('should not call onTimeout event');
	});

	var start = new Date().getTime();
	while(true) {
		if(t.exceeded(10, 20)) break;
		break;
	}
	var end = new Date().getTime();

	test.ok(100 > end-start);
	test.done();
};