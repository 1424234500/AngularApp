 
angular.module('com.cache')

.controller('com.cache.pageCtrl', ['$PROJECT','$scope', '$rootScope', '$state', 'baseService', function ($PROJECT, $scope, $rootScope, $state, baseService) {
    //嵌套路由 scope可访问 <任意module> 的上层html的 ctrl/scope
    var mName = 'cache';
    $scope.mName = mName;
    $scope.search = {};
    $scope.cols = ["URL", "KEY", "VALUE", "EXPIRE", "TYPE"];
    $scope.showCols = ["KEY", "VALUE", "HASHCODE", "EXPIRE", "TYPE", "MTIME"];



    $scope.list = function(){
        var params = $scope.search;
        var url = '/' + $PROJECT + '/tomcat/listCacheMap.do';
        baseService.post(url, params).then(
            function (data) {
                $scope.listCache = data.list;
                $scope.search.urls = data.urls;
            }, error);
    };

    $scope.list();
}])


