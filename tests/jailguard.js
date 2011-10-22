var jailguard = require('jailguard');


exports.testNormal = function(test) {
	
	var jg = jailguard.create();
	var env = {aa: 0};
	var code = "aa = 100;"
	jg.run(code, env, function(err) {
		
		test.ok(!err);
		test.equal(100, env.aa);
		test.done();
	});
};

exports.testKillAndRestart = function(test) {
	
	var jg = jailguard.create();
	jg._child.kill('SIGQUIT');
	
	
	setTimeout(function() {
		
		var env = {aa: 0};
		var code = "aa = 100;"
		jg.run(code, env, function(err) {
			test.ok(!err);
			test.equal(100, env.aa);
			test.done();
		});
	}, 10);
};

/// Tests from jail.js

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