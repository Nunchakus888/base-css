(function (angular) {
    'use strict';
    
    var mainModule = angular.module("app", ['angularCSS']);
    
    // Http Config
    mainModule.factory('appInterceptor', [
        '$q', '$injector', 'appConfig', function ($q, $injector, appConfig) {
            
            return {
                request: function (config) {
                    if (appConfig.service_root) config.url = appConfig.service_root + config.url;
                    
                    return config;
                },
                requestError: function (config) {
                    return $q.reject(config);
                },
                response: function (response) {
                    return response;
                },
                responseError: function (response) {
                    return $q.reject(response);
                }
            };
        }
    ]).config([
        '$httpProvider', function ($httpProvider) {
            
            $httpProvider.interceptors.push('appInterceptor');
        }
    ]);

})(angular);