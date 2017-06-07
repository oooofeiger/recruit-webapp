angular.module('app').controller('positionCtrl',['$scope','$http','$state','$q','cache',function($scope, $http, $state, $q, cache){
	$scope.isLogin = !!cache.get('name');
	$scope.message = $scope.isLogin?'投个简历':'去登陆';
	function getPosition(){
		var def = $q.defer();
		$http.get('/data/position.json?id='+$state.params.id).then(function(res){
			$scope.position = res.data;
			if($scope.posted){
				$scope.message = '已投递'
			}
			def.resolve(res.data);
		}).catch(function(err){
			def.reject(err);
		});
		return def.promise;
	}
	function getCompany(id){
		$http.get('/data/company.json?id='+id).then(function(res){
			$scope.company = res.data;
		})
	}

	getPosition().then(function(res){
		getCompany(res.companyId);
	});

	$scope.go = function(){
		if($scope.message !== '已投递'){
			if($scope.isLogin){
				$http.post('data/handle.json', {id:$scope.position.id}).then(function(res){
					console.log(res.data);
					$scope.message = '已投递'
				})
			}else{
				$state.go('login')
			}
		}
	}
}])