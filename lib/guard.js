/**
	A Node.js fork compatible module.
	Which work as an child to be aspawned and process JS
*/


var jailModule = require('./jail');

var jail;

process.on('message', function(msg) {
	
	if(msg && msg.type == 'create') {
		
		processCreate(msg.options);
	} else if(msg && msg.type == 'run') {
		
		processRun(msg.id, msg.code, msg.env);
	}
});

function processCreate(options) {
	
	jail = jailModule.create(options);
	console.info('creating a jail with options: ' + JSON.stringify(options));
}

function processRun(id, code, env) {
	
	if(jail) {
		
		jail.run(code, env, function(err) {
			
			process.send({
				type: 'run',
				id: id,
				env: env,
				error: err	
			});
		});
	} else {
		console.warn('jail is not created yet');
	}
}

