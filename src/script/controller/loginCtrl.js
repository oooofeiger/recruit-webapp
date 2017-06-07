angular.module('app').controller('loginCtrl',['$scope','$http','$state','cache', function($scope, $http, $state, cache){
	$scope.submit = function(){
		$http.post('data/login.json', $scope.user).then(function(res){
			cache.set('id', res.data.id);
			cache.set('name', res.data.name);
			cache.set('image', res.data.image);

			$state.go('main');
		})
	}
}])