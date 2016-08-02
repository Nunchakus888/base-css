var colors = require("colors"),
    path = require("path"),
    fs = require("fs");

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var config = require("../modules/configs"),
        auth = require("../modules/auth");
    
    function middleware(req, res, next) {

        var foundIndex = -1;
        config.directoryWhiteList.forEach(function(item, index) {
            var reg = new RegExp("^" + item);
            if (reg.test(req.originalUrl)) {
                foundIndex = index;
            }
        });

        if (foundIndex > -1) {
            next();
        } else if (/^\/service/.test(req.originalUrl)) {
            if (req.originalUrl === config.loginSetting.serviceUrl) {
                next();
            } else {
                if (auth.checkServiceRequest(req)) {
                    if (req.originalUrl.indexOf("update") > -1 || req.originalUrl.indexOf("add") > -1) {
                        if (auth.checkEditable(req)) {
                            next();
                        } else {
                            res.writeHead(500);
                            res.write(JSON.stringify({
                                status: "500",
                                message: 'Access decline.'
                            }));
                            res.end();
                        }
                    } else {
                        next();
                    }
                } else {
                    res.writeHead(401);
                    res.write(JSON.stringify({
                        status: "401",
                        message: 'Not login.'
                    }));
                    res.end();
                }
            }
        } else {
            if (req.originalUrl === config.loginSetting.url) {
                next();
            } else {
                if (auth.checkHtmlRequest(req)) {
                    next();
                } else {
                    var url = path.join(config.httpBasePath, config.httpErrPage.err_401);

                    if (fs.existsSync(url)) {
                        res.sendFile(url, function () { res.end(); });
                    } else {
                        res.writeHead(200);
                        res.write("Not login. Login link: <a href='/login.html'>/login.html</a>");
                        res.end();
                    }
                }
            }
        }
    };
    
    return middleware;
}();

