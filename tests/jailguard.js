var jailguard = require('jailguard');

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