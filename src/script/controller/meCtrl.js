angular.module('app').controller('meCtrl',['$scope','cache','$state', function($scope, cache, $state){
	if(cache.get('name')){
		$scope.image = cache.get('image');
		$scope.name = cache.get('name');
	}

	$scope.logout = function(){
		cache.remove('id');
		cache.remove('name');
		cache.remove('image');
		$state.go('main');
	}
}])