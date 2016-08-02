(function (angular) {
    'use strict';
    
    angular.module('app').constant('appConfig', {
        // jenkins
        // service_root: '.',
        
        get_menuConfig: 'menuConfig.json',
        
        post_getComponents: 'service/getComponents',

        post_applyCss: 'service/applyCss'
    });


})(angular);