// ReSharper disable Es6Feature
var colors = require("colors"),
    fs = require("fs"),
    rd = require("rd"),
    path = require('path');

const utility = require("../../common/utility");
// ReSharper restore Es6Feat

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    function loadComponents(configs) {
        
        if (!configs || configs.length <= 0 || !(configs instanceof Array)) return configs;
        
        configs.forEach(function (item, index) {
            if (!item.history || item.history.length <= 0 || !(item.history instanceof Array)) return;
            
            item.history.forEach(function (item1, index1) {
                if (!item1) return;
                
                try {
                    item1.loadedSample = fs.readFileSync(path.join(item.folderPath, item1.sample) , 'utf8');
                } catch (e1) {
                    item1.loadedSample = JSON.stringify(e1);
                }
                
                try {
                    item1.loadedCode = fs.readFileSync(path.join(item.folderPath, item1.code), 'utf8');
                } catch (e2) {
                    item1.loadedCode = JSON.stringify(e2);
                }
            });
        });
        
        return configs;
    };
    
    var middleware = function (req, res, next) {
        
        var configs = utility.getConfigs();
        
        var data = '';
        req.addListener('data', function (chunk) {
            data += chunk;
        }).addListener('end', function () {
            data = JSON.parse(data);
            
            configs = loadComponents(configs.findWhere(function (e) {
                return e.class === data.class;
            }));
            
            var result = {
                result: configs
            };

            res.status(200).send(JSON.stringify(result));
            
            res.end();
        });
    };
    
    return middleware;
}();

