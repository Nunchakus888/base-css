var colors = require('chalk');

module.exports = function(req, res, finish) {
	var newEnd = res.end;
	req.requestTime = new Date;
	var indent = req.app.get('log.indent') || '';
	res.end = function() {
		res.responseTime = (new Date) - req.requestTime;
		res.end = newEnd;

		console.log(
			indent +
			(
				req.method == 'GET' ? colors.green('GET  ') :
				req.method == 'POST' ? colors.blue.bold('POST ') :
				req.method == 'PUT' ? colors.blue.bold('PUT  '):
				req.method == 'DELETE' ? colors.blue.bold('DELETE'):
				req.method == 'PATCH' ? colors.blue.bold('PATCH') :
				colors.green(req.method)
			) + ' ' +
			(
				res.statusCode >= 400 ? colors.red(res.statusCode) :
				colors.grey(res.statusCode)
			) + ' ' +
			req.originalUrl + ' ' +
			colors.grey(res.responseTime + 'ms')
		);

		res.end.apply(res, arguments);
	};
	finish();
};
