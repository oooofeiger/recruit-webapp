angular.module('app').controller('registerCtrl',['$scope','$http','$interval','$state', function($scope, $http, $interval,$state){
	$scope.submit = function(){
		$http.post('data/regist.json', $scope.user).then(function(res){
			$state.go('login')
		})
	};

	
	$scope.send = function(){
		var count = 60;
		$http.get('data/code.json').then(function(res){
			if(res.data.state === 1){
				$scope.time= '60s';
				var interval = $interval(function(){
					if(count<=0){
						$interval.cancel(interval);
						$scope.time= '重新发送';
						return ;
					}
					count--;
					$scope.time = count + 's';
				}, 1000)
			}
		})
	}
}])