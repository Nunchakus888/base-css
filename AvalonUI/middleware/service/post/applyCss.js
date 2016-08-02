// ReSharper disable Es6Feature
var colors = require("colors"),
    fs = require("fs"),
    rd = require("rd"),
    path = require('path'),

    gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpCss = require('gulp-clean-css');

const utility = require("../../common/utility");
// ReSharper restore Es6Feature

// ReSharper disable UndeclaredGlobalVariableUsing
module.exports = function () {
    'use strict';
    
    function concatCss(configs, version) {
        if (!configs || configs.length < 1 || !(configs instanceof Array)) return;
        
        if (!version) return;
        
        var componentCss = configs.map(function (e) {
            if (!e.history || e.history.length < 1 || !(e.history instanceof Array)) return undefined;            

            var css = e.history.findItem(function (e1) {
                return e1.version === version;
            });
            
            if (!css) {
                var max = e.history.sort(function (e1, e2) { return (+e2.version) - (+e1.version); })[0];

                if (!max) return undefined;

                css = max;
            }
            
            return path.join(e.folderPath, css.cssFile);
        });
        
        var outputFileName = "ss_common_style_" + version.replace(".", "_") + ".css";
        
        var outputPath = path.join(__dirname, "../../../release_styles");
        
        gulp.src(componentCss)
        .pipe(concat(outputFileName))
        .pipe(gulp.dest(outputPath))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulpCss())
        .pipe(gulp.dest(outputPath));
    };
    
    var middleware = function (req, res, next) {
        
        var configs = utility.getConfigs();
        
        var data = '';
        req.addListener('data', function (chunk) {
            data += chunk;
        }).addListener('end', function () {
            data = JSON.parse(data);
            
            concatCss(configs, data.version);
            
            setTimeout(function () {
                res.status(200);
                
                res.end();
            }, 1000);
            
            
        });
    };
    
    return middleware;
}();

