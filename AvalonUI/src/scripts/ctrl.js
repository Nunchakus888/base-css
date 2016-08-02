(function (angular) {
    'use strict';
    
    angular.module("app").controller('ctrl', ['$scope', function ($scope) {
            
            $scope.onChangeCssVersion = function () {
                
                debugger;
                if (!$scope) return;

                console.log($scope.item);
            };

        }]);

})(angular);