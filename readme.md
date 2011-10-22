Jail Guard
==========

An attempt to Execute User Provided JavaScript securly. Jail Guard,

* runs scripts on a seperate process
* detects never ending loops
* blocks `eval`, `setTimeout` and `setInterval`

Install
-------
	sudo npm install jailguard -g


Usage
-----

	var jailguard = require('jailguard');
	var assert = require('assert');
	
	var jg = jailguard.create();
	var env = {aa: 0};
	var code = "aa = 100;"
	jg.run(code, env, function(err) {
		assert.equal(100, env.aa);
	});
