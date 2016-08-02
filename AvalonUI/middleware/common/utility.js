var colors = require("colors"),
    fs = require("fs"),
    rd = require("rd"),
    path = require('path');

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    var getConfigs = function () {
        var dir = path.join(__dirname, '../../components');
        
        var configs = [];
        
        rd.eachFileFilterSync(dir, /config.json$/, function (file, s) {
            try {
                var config = eval("(" + fs.readFileSync(file, 'utf8') + ")");

                config.folderPath = path.dirname(file);
                
                configs.push(config);
            } catch (e) {
                console.error("getComponents: Load config file failed: " + JSON.stringify(e));
            }
        });
        
        return configs;
    };
    
    return {
        getConfigs: getConfigs

    };
}();

