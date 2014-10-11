# Extension Scripts

The 'extensions' folder in your repository contains modules that are loaded in your Mobile Service to extend the runtime.

## Startup script

Startup script is loaded in your Mobile Service when it is first loaded into memory. You can put Node.js module in the 'extensions' folder called 'startup.js' that has a 'startup' method exported from it as shown below:

	exports.startup = function(context, done) {
		context.app.get('/hello', function(req, res) {
			res.send(200, 'world');
		});
		done();
	};

Note that your app will only start processing requests after your startup script has been successfully loaded and invoked. Therefore, it is important to ensure you call the 'done' callback after your extension has completed it's work, to pass control back to the runtime.