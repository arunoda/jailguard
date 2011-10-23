var jailguard = require('jail');

exports.testRunSuccess = function(test) {
	
	var jg = jailguard.create();
	var js = "abc = 10 + 20;"
	var env = {abc: null}
	jg.run(js, env, function(err) {
		console.log(err);
		test.ok(!err);
		test.equal(env.abc, 30);
		test.done();
	});
};

exports.testRunError = function(test) {
	
	var jg = jailguard.create();
	var js = "abc 34 34 10 + 20;" // error code
	var env = {abc: null}
	jg.run(js, env, function(err) {
		test.ok(err);
		test.equal(env.abc, null);
		test.done();
	});
};
 
exports.testRunNeverEndingLoopDetect = function(test) {
	
	var jg = jailguard.create({timeout: 100});
	var js = "var aa = 10; while(true) { abc=++aa;} \n ccd=200;";
	var env = {abc: 10, ccd: null}
	jg.run(js, env, function(err) {
		test.ok(err);
		test.equal(err.code, 'NEVER_ENDING_LOOP');
		test.done();
	});

};

exports.testRunNormalLoopDetect = function(test) {
	
	var jg = jailguard.create({timeout: 100});
	var js = "var aa = true; while(aa) { aa= false;} \n ccd=200;";
	var env = {abc: 10, ccd: null}
	jg.run(js, env, function(err) {
		test.ok(!err);
		test.done();
	});

};

exports.testRunNeverEndingForLoopDetect = function(test) {
	
	var jg = jailguard.create({timeout: 100});
	var js = "var aa = 10; for(var aa=0; true; aa++) { abc=++aa;} \n ccd=200;";
	var env = {abc: 10, ccd: null}
	jg.run(js, env, function(err) {
		test.ok(err);
		test.equal(err.code, 'NEVER_ENDING_LOOP');
		test.done();
	});

};

exports.testRunNormalForLoopDetect = function(test) {
	
	var jg = jailguard.create({timeout: 100});
	var js = "var aa = 10; for(var aa=0; aa <10 ; aa++) { abc=++aa;} \n ccd=200;";
	var env = {abc: 10, ccd: null}
	jg.run(js, env, function(err) {
		test.ok(!err);
		test.done();
	});

};

exports.testNoEval = function(test) {
	
	var jg = jailguard.create({timeout: 100});
	var js = "var aa = 10; eval('aa=100;') ";
	var env = {aa: 0, ccd: null}
	jg.run(js, env, function(err) {
		test.ok(err);
		test.equal(err.code, 'EVAL_NOT_SUPPORTED');
		test.done();
	});
};

exports.testNoSetTimeout = function(test) {
	
	var jg = jailguard.create({timeout: 100});
	var js = "var aa = 10; setTimeout(function() {aa=100}, 0); ";
	var env = {aa: 0, ccd: null}
	jg.run(js, env, function(err) {
		test.ok(err);
		test.equal(err.code, 'SETTIMEOUT_NOT_SUPPORTED');
		test.done();
	});
};

exports.testNoSetInterval = function(test) {
	
	var jg = jailguard.create({timeout: 100});
	var js = "var aa = 10; setInterval(function() {aa=100}, 0); ";
	var env = {aa: 0, ccd: null}
	jg.run(js, env, function(err) {
		test.ok(err);
		test.equal(err.code, 'SETINTERVAL_NOT_SUPPORTED');
		test.done();
	});
};

exports.testFunctionConstructor = function(test) {

	var jg = jailguard.create();
	var js = "var fn = new Function('aa=100;'); fn();";
	var env = {aa: 10};

	jg.run(js, env, function(err) {

		test.equal(env.aa, 10);
		test.equal(err.code, 'FUNCTION_CONSTRUCTOR_DETECTED');
		test.done();
	});
};