express-log-url
===============
Simple, nice-looking, logging for Express.

![Screenshot](docs/screenshot.png)


Installation
============

Install package
---------------

	npm --save install express-log-url


Install within Express
----------------------

	// Somewhere within your server setup

	app.use(require('express-log-url'));


Options
=======
Set the following options via `app.set('OPTION', 'VALUE');`

| Setting      | Type   | Default | Description               |
|--------------|--------|---------|---------------------------|
| `log.indent` | String | `null`  | Prefix for any log entry  |
