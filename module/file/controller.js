 
angular.module('com.file')

.controller('com.file.pageCtrl', ['$scope', '$rootScope', '$state', 'fileService', function ($scope, $rootScope, $state, fileService) {
    //嵌套路由 scope可访问 <任意module> 的上层html的 ctrl/scope
    var mName = 'file';
    $scope.mName = mName;

    $scope.goHome = function(){
        $state.go('main.file.list');
    }
    $scope.goAdd = function(){
        $state.go('main.file.add');
    }
    $scope.goUpdate = function(id){
        var params = {"id":id};
        $state.go('main.file.update', params);
    }


    $('#charttimefrom').datetimepicker();
    $('#charttimeto').datetimepicker();
    $scope.chart = {}; //查询
    $scope.chart.TIMEFROM = "2015";
    $scope.chart.TIMETO = "2017";
    $scope.statis = function(){
        //debugger;
        var params = $scope.chart;
          //按月统计，每月注册人数
        fileService.statis(params).then(
        function (data) {
            // debugger;
            info(data);
            //data.option = $.extend({"yAxis":{}}, data.option )
            toolSetChart("echarts", data.option);
        }, function(error){
            alert("eeeeeeeeeeeee");
        });
    };
    //$scope.statis();

    $scope.dir = "C:\\tomcat\\download";
    $scope.search={};
    $scope.search['NAME'] = "";
    $scope.goBack = function(){
        var path = $scope.dir;
        var ps = path.split('\\');
        console.log(ps);
        if(ps.length > 0){
            path = path.substr(0, path.length - ps[ps.length - 1].length - 1)
        }
        $scope.dir = path;
        $scope.name = "";
        $scope.list();
    };
    $scope.clickFile = function(item){
        if(item.TYPE != 'dir'){
            $scope.download(item.PATH)
            return;
        }
        $scope.dir = item.PATH;
        $scope.name = "";
        $scope.list();
    };
    $scope.list = function(){
        var params = {};
        params["dir"] = $scope.dir;
        params["name"] = $scope.name;
        fileService.fileDir(params).then(
            function (data) {
                $scope.httplist = data;
            }, error);
    };
    $scope.list();
    $scope.keydown = function(event){
        if (event.keyCode == 13) {
            $scope.list();
        }
    };
    $scope.download = function(path){
        var params = {"path":path};
        var url = "/BaseSSM/file/download.do?path=" + (path);
        openUrl(url);
    };
    $scope.ajaxDelete = function(id){
        var params = {};
        params["PATH"] = id;
        fileService.del(params).then(
            function (data) {
                info("操作数据:" + data.res + "条");
                $scope.list();
            }, error);

    };

    //加载表信息
    fileService.fileCols().then(
        function (data) {
            $scope.cols = data;
        }, error);





}])
.controller('com.file.addCtrl', ['$scope', '$rootScope', 'fileService', function ($scope, $rootScope, fileService) {


    $('#time').datetimepicker();
    $scope.ajaxSubmit = function(){
        var params =  $scope.httpget;
        fileService.update(params).then(
            function (data) {
                info("操作数据:" + data.res + "条");
                $scope.goHome();
        }, error);
    };
}])
.controller('com.file.updateCtrl', ['$scope', '$rootScope', '$stateParams', 'fileService', function ($scope, $rootScope, $stateParams, fileService) {


    $scope.params = $stateParams;
    info("stateParams");
    info($scope.params);
    var params = $scope.params;
    fileService.get(params).then(
        function (data) {
            $scope.httpget = data;
        }, error);


    $('#time').datetimepicker();
    $scope.ajaxSubmit = function(){
        var params = $scope.httpget;
        fileService.update(params).then(
            function (data) {
                info("操作数据:" + data.res + "条");
                $scope.goHome();
            }, error);

    };
}])
.controller('com.file.listCtrl', ['$scope', '$rootScope', '$state', 'fileService', function ($scope, $rootScope, $state, fileService) {


    //bootstrap日期插件使用方式
    $('#timefrom').datetimepicker();
    $('#timeto').datetimepicker();

    $scope.search = {}; //查询
    $scope.orderType = 'id';
    $scope.order = '-';
    $scope.changeOrder = function(type){
        $scope.orderType = type;
        if($scope.order === ''){
            $scope.order = '-';
        }else{
            $scope.order = '';
        }
    };
    $scope.list = function(){
        //debugger;
        var PAGE = $scope.PAGE;
        var search = $scope.search;
        params = $.extend({}, PAGE, search);
        fileService.list(params).then(
            function (data) {
                $scope.httplist = data.res;
                $scope.PAGE = data.PAGE;
                $scope.ppp = calcPage($scope.PAGE);
        }, error);
    };
    $scope.list();

    $scope.ajaxDelete = function(id){
        var params = {"id":id};
        fileService.del(params).then(
            function (data) { 
                info("操作数据:" + data.res + "条");
                $scope.list(); 
        }, error);  

    };

    $scope.download = function(id){
        var params = {"id":id};
        var url = "/BaseSSM/file/download.do?id=" + id;
        openUrl(url);
    };

}])


