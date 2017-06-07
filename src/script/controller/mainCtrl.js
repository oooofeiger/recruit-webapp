angular.module('app').controller('mainCtrl',['$http','$scope',function($http,$scope){
	$http.get('/data/positionList.json').then(function(res){
		console.log(res)
		$scope.list = res.data;
	})
}])