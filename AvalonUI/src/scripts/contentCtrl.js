(function (angular, prettyPrint) {
    'use strict';
    
    angular.module("app").controller('contentCtrl', [
        '$scope', '$http', '$q', '$sce', '$css', 'appConfig', 'commonService', 
        function ($scope, $http, $q, $sce, $css, appConfig, commonService) {
            
            var isCssMinCache = false;
            
            /// Private functions 
            function setMenuClass(item) {
                if (!item) return item;
                
                if (item.type === "divider") {
                    item.class = "divider";
                    return item;
                }
                
                if (item.disabled && item.disabled === "true") {
                    item.class = "disabled";
                    return item;
                }
                
                if (item.members && item.members.length > 0) {
                    item.memberClass = "dropdown-toggle";
                    
                    item.members.forEach(function (item1, index1) {
                        setMenuClass(item1);
                    });
                }
                
                return item;
            };
            
            function setMenuTag(item, parentTag) {
                if (!item) return item;
                
                item.tag = parentTag ? parentTag + "." + item.id : item.id;
                
                if (item.members && item.members.length > 0) {
                    item.members.forEach(function (item1, index1) {
                        setMenuTag(item1, item.tag);
                    });
                }
                
                return item;
            };
            
            function loadMainMenu(data) {
                if (!data || !(data instanceof Array)) return;
                
                data.forEach(function (item, index) {
                    setMenuClass(item);
                    setMenuTag(item, data.id);
                });
                
                $scope.mainMenu = data;
            };
            
            function loadConfig(data) {
                if (!data) return;
                
                if (data.mainMenu) loadMainMenu(data.mainMenu);

            };
            
            function getComponents(data) {
                $http.post(appConfig.post_getComponents, data).then(function (res) {
                    if (!res || !res.data || !res.data.result || !(res.data.result instanceof Array)) {
                        console.error("contentCtrl: getComponents null. " + JSON.stringify(res));
                        return;
                    }
                    
                    // ReSharper disable UndeclaredGlobalVariableUsing
                    var historySet = new Set();
                    // ReSharper restore UndeclaredGlobalVariableUsing
                    
                    res.data.result.forEach(function (item, index) {
                        if (!item || !item.history || !(item.history instanceof Array)) return;
                        
                        item.history.forEach(function (item1, index1) {
                            historySet.add(item1.version);
                            
                            item1.loadedSample = $sce.trustAsHtml(item1.loadedSample);
                        });
                        
                        item.displayOrder = +item.displayOrder;
                    });
                    
                    $scope.componentList = res.data.result;
                    
                    $scope.historyMenu = Array.from(historySet).sort(function (e1, e2) { return (+e2) - (+e1); }).map(function (e) {
                        return {
                            displayName: e + "",
                            version: e,
                            css: "../release_styles/ss_common_style_" + e.replace(".", "_") + ".css"
                        }
                    });
                    
                    $scope.vm.selectedVersion = $scope.historyMenu[0];
                    
                    if ($scope.onChangeCssVersion) $scope.onChangeCssVersion();
                    
                    refreshView();
                }, function (res) {
                    console.error("contentCtrl: getComponents error. " + JSON.stringify(res));
                });
            };
            
            function refreshView() {
                commonService.safeApply($scope, function () {
                    setTimeout(function () {
                        prettyPrint();
                    }, 100);
                });
            };
            
            /// Exported to $scope functions 
            $scope.onChangeCssVersion = function () {
                if (!$scope.vm || !$scope.vm.selectedVersion) return;
                
                $css.removeAll();
                
                $css.bind({
                    href: $scope.vm.selectedVersion.css
                }, $scope);
            };
            
            $scope.onClickMainMenuItem = function (item) {
                if (item.disabled === "true" || item.type === "divider" || !item.tag || item.tag.indexOf("undefined") >= 0) return;
                
                if (item.members && item.members.length > 0) return;
                
                $scope.selectedMenuItem = item;
                
                getComponents({ 'class': item.tag });
            };
            
            $scope.onClickApplyCss = function () {
                $http.post(appConfig.post_applyCss, { version: $scope.vm.selectedVersion.version }).then(function (res) {
                    $css.removeAll();
                    
                    console.log("Css loaded on applyCss: " + $scope.vm.selectedVersion.css + Date());
                    
                    $css.bind({
                        href: isCssMinCache ? $scope.vm.selectedVersion.css : $scope.vm.selectedVersion.css.replace(".css", ".min.css")
                    }, $scope);
                    
                    isCssMinCache = !isCssMinCache;
                    
                }, function (res) {
                    console.error("Error on applyCss: " + JSON.stringify(res));
                });
            };

            $scope.onClickDownloadCss = function () {
                window.open($scope.vm.selectedVersion.css);
            };

            $scope.getHistoryByVersion = function (historys, version) {
                if (!historys || historys.length < 1 || !(historys instanceof Array)) return $scope.selectedVersion;

                return historys.findItem(function(e) { return e.version === version; });
            };
            
            var initView = function () {
                
                $scope.vm = {};

                $scope.dialogVm = {};

                $http.get(appConfig.get_menuConfig).then(function (res) {
                    loadConfig(res.data);
                }, function (res) {
                    if (res && res.message) {
                        console.error("Load config.json failed. \r\n" + res.message);
                    }
                });
            }();

        }]);

})(angular, prettyPrint);