var request = require('request');
var config = require('./config.json');
var register_page = require('./hack.js');

module.exports = function(parsedFile, service, index) {
	if(!service.modules_url)
		return;

	if(config.log_verbose)
		console.log("Querying " + service.name + " on " + service.modules_url);

	request(service.modules_url, (err, res, body) => {
		if(err) {
			console.error("Could not fetch modules for " + service.name, err);
			return;
		}

		try {
			body = JSON.parse(body);
		} catch(err) {
			console.error("Could not parse modules response from " + service.name, err);
			if(config.log_verbose) {
				console.log("------------------------------- Faulty response from " + service.name + " -----------------------------");
				console.log(body);
			}
			return;
		}

		module = body;
		module.url = service.frontend_url;
		module.servicename = service.name;
		parsedFile.modules.push(module);

		service.modules = module;

		// TODO remove as soon as hack is unnecessary
		register_page(module, service);
	});
}
