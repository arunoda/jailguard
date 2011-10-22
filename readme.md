Jail Guard
==========

An attempt to Execute User Provided JavaScript securly. Jail Guard,

* runs scripts on a seperate process
* detect never ending loops
* block `eval`, `setTimeout` and `setInterval`

Install
-------
	sudo npm install jailguard -g


Usage
-----

	var jailguard = require('jailguard');
	var jg = jailguard.create();
	var env = {aa: 0};
	var code = "aa = 100;"
	jg.run(code, env, function(err) {
		
		test.ok(!err);
		test.equal(100, env.aa);
		test.done();
	});
