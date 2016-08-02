(function (require, process, dirname) {
    'use strict';
    
    var colors = require("colors"),
        path = require("path"),
        express = require("express"),
        logger = require('express-log-url'),
        domain = require('express-domain-middleware');
    
    
    require(path.join(dirname, 'middleware/common/ArrayUtils'));
    
    
    var port = process.env.port || 8181;
    
    var app = express();
    
    // 使用该中间件，在下方的处理中捕获异步程序中的异常。
    app.use(domain);
    
    // logger
    app.use(logger);

    // Service    
    app.use('/service', require(path.join(dirname, 'middleware/serviceRouter')));
    
    if (process.argv.length > 0 && process.argv[2] === "debug") {
        app.use(express.static('src'));
        app.use('/bower_components', express.static('bower_components'));
    } else {
        app.use(express.static('dist'));
    }
    
    app.use('/release_styles', express.static('release_styles'));
    
    // 一般来说非强制性的错误处理一般被定义在最后
    // 错误处理的中间件和普通的中间件定义是一样的， 只是它必须有4个形参， 这是它的形式： (err, req, res, next):
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });
    
    app.listen(port, function () {
        console.log("Listening on " + port);
    });

})(require, process, __dirname);