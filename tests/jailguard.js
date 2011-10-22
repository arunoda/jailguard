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