angular.module('app').controller('companyCtrl',['$scope','$http','$state','cache',function($scope, $http, $state, cache){
	cache.set('abc', '123');
	console.log(cache.get('abc'))
	$http.get('/data/company.json?id='+$state.params.id).then(function(res){
		$scope.company = res.data;
	})
}])