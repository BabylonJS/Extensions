# Shared Scripts

The 'shared' folder in your repository contains code that is reused by other scripts in your mobile service, or special utility functions such as collecting feedback from [APNS](http://go.microsoft.com/fwlink/p/?linkid=272584&clcid=0x409).

## Shared Code

You can put Node.js modules in this folder and easily load them from other scripts. For example, create a calc.js file with the following:

	exports.add = function(a, b) { return a + b; };

You could then reuse this functionality from another script in the system:

	var calc = require('../shared/calc.js');
	var result = calc.add(1,2);

## APNS Feedback Script

You can write a script that will automatically be run by Mobile Services to collect feedback from the APNS service by putting an `apnsfeedback.js` script into the shared folder.

## More Information

For more information see the [documentation](http://go.microsoft.com/fwlink/?LinkID=307138&clcid=0x409).