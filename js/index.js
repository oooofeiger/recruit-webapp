'use strict'

angular.module('app',['ui.router','ngCookies','validation','ngAnimate'])
//定义一个全局变量dict，run是页面编译之前就运行了
angular.module('app').value('dict', {}).run(['$http','dict', function($http, dict){
	$http.get('data/city.json').then(function(res){
		dict.city = res.data;
	});
	$http.get('data/salary.json').then(function(res){
		dict.salary = res.data;
	});
	$http.get('data/scale.json').then(function(res){
		dict.scale = res.data;
	});
}])
angular.module('app').config(['$provide', function($provide){
	$provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
		var get = $delegate.get;
		$delegate.post = function(url, data, config){
			var def = $q.defer();
			get(url).then(function(res){
				def.resolve(res);
			}).catch(function(err){
				def.reject(err)
			});
			return {
				then: function(cb){
					def.promise.then(cb)
				},
				catch: function(cb){
					def.promise(null, cb)
				}
			}
		}
		return $delegate;
	}])
}])
'use strict'

angular.module('app').config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){
	$stateProvider.state('main', {
		url: '/main',
		templateUrl : "../../view/main.html",
		controller: 'mainCtrl'
	}).state('position', {
		url : '/position/:id',
		templateUrl : '../../view/position.html',
		controller: 'positionCtrl'
	}).state('company', {
		url : '/company/:id',
		templateUrl : '../../view/company.html',
		controller: 'companyCtrl'
	}).state('search', {
		url : '/search/',
		templateUrl : '../../view/search.html',
		controller: 'searchCtrl'
	}).state('login', {
		url : '/login/',
		templateUrl : '../../view/login.html',
		controller: 'loginCtrl'
	}).state('register', {
		url : '/register/',
		templateUrl : '../../view/register.html',
		controller: 'registerCtrl'
	}).state('favorite', {
		url : '/favorite/',
		templateUrl : '../../view/favorite.html',
		controller: 'favoriteCtrl'
	}).state('post', {
		url : '/post/',
		templateUrl : '../../view/post.html',
		controller: 'postCtrl'
	}).state('me', {
		url : '/me/',
		templateUrl : '../../view/me.html',
		controller: 'meCtrl'
	});

	$urlRouterProvider.otherwise('main');
}]);
angular.module('app').config(['$validationProvider', function($validation){
	var expression = {
		phone : /^1[\d]{10}$/,
		password : function(value){
			var str = value + '';
			return str.length > 5
		},
		required : function(value){
			return !!value;
		}
	};
	var defaultMsg = {
		phone: {
			success: '',
			error: '必须是11位手机号'
		},
		password: {
			success: '',
			error: '长度至少6位'
		},
		required: {
			success: '',
			error: '不能为空'
		}
	}

	$validation.setExpression(expression).setDefaultMsg(defaultMsg)
}])
angular.module('app').controller('companyCtrl',['$scope','$http','$state','cache',function($scope, $http, $state, cache){
	cache.set('abc', '123');
	console.log(cache.get('abc'))
	$http.get('/data/company.json?id='+$state.params.id).then(function(res){
		$scope.company = res.data;
	})
}])
angular.module('app').controller('favoriteCtrl',['$scope','$http', function($scope, $http){
	$http.get('data/myFavorite.json').then(function(res){
		$scope.list = res.data;
	})
}])
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
angular.module('app').controller('mainCtrl',['$http','$scope',function($http,$scope){
	$http.get('/data/positionList.json').then(function(res){
		console.log(res)
		$scope.list = res.data;
	})
}])
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
angular.module('app').controller('postCtrl',['$scope','$http', function($scope, $http){
	$scope.tabList = [{
		id: 'all',
		name: '全部'
	},{
		id: 'pass',
		name: '面试邀约'
	},{
		id: 'fail',
		name: '不合适'
	}];

	$http.get('data/myPost.json').then(function(res){
		$scope.positionList = res.data;
	});

	$scope.filterObj = {};
	$scope.tClick = function(id, name){
		switch(id){
			case 'all':
				delete $scope.filterObj.state;
				break;
			case 'pass':
				$scope.filterObj.state = '1';
				break;
			case 'fail':
				$scope.filterObj.state = '-1';
				break;
		}
	}
}])
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
angular.module('app').controller('searchCtrl',['$scope','$http','dict', function($scope,$http,dict){
	$scope.name = '';
	$scope.search = function(){
		$http.get('data/positionList.json?name='+$scope.name).then(function(res){
			$scope.positionList = res.data;
		});
	};
	$scope.search();
	$scope.sheet = {};
	$scope.tabList = [{
		id: 'city',
		name: '城市'
	},{
		id: 'salary',
		name: '薪资'
	},{
		id: 'scale',
		name: '公司规模'
	}];
	var tabId = '';
	$scope.filterObj = {};
	$scope.tClick = function(id){
		tabId = id;
		$scope.sheet.list = dict[id];
		$scope.sheet.visible = true;
	}
	$scope.sClick = function(id, name){
		console.log(id)
		if(id){
			angular.forEach($scope.tabList, function(item){
				if(item.id === tabId){
					item.name = name;
				}
			})
			$scope.filterObj[tabId+'Id'] = id;
			console.log($scope.filterObj)
		}else{
			delete $scope.filterObj[tabId+'Id'];
			angular.forEach($scope.tabList, function(item){
				if(item.id === tabId){
					switch(item.id){
						case 'city':
							item.name = '城市';
							break;
						case 'salary':
							item.name = '薪资';
							break;
						case 'scale':
							item.name = '公司规模';
							break;
					}
				}
			})
		}
	}
}])
angular.module('app').service('cache', ['$cookies',function($cookies){
	this.set = function(key, value){
		$cookies.put(key, value);
	};

	this.get = function(key){
		return $cookies.get(key);
	}

	this.remove = function(key){
		$cookies.remove(key);
	}
}])
angular.module('app').directive('appCompany',[function(){
	return {
		restrict : 'A',
		replace : true,
		templateUrl : '../view/template/company.html',
		scope: {
			com: '='
		}
	}
}]);
angular.module('app').directive('appFoot',[function(){
	return {
		restrict : 'A',
		replace : true,
		templateUrl : '../view/template/foot.html'
	}
}])
angular.module('app').directive('appHead',['cache',function(cache){
	return {
		restrict : 'A',
		replace : true,
		templateUrl : '../view/template/head.html',
		link: function(scope){
			scope.name = cache.get('name');
		}
	}
}]);
angular.module('app').directive('appHeadBar',[function(){
	return {
		restrict : 'A',
		replace : true,
		templateUrl : '../view/template/headBar.html',
		scope : {
			text : '@'
		},
		link : function(scope, ele, attr){
			scope.back = function(){
				window.history.back();
			}
		}
	}
}]);
'use strict'
angular.module('app').directive('appPositionClass', [function(){
	return {
		restrict : 'A',
		replace : true,
		templateUrl : '../view/template/positionClass.html',
		scope: {
			com : '='
		},
		link : function($scope,ele,attr){
			$scope.showPositionList = function(idx){
				$scope.isClick++;
				$scope.positionList = $scope['com'].positionClass[idx].positionList;
				$scope.isActive = idx;
			}

			//com数据绑定是一个异步的过程，com还没有加载数据时link函数已经执行，所以直接使用
			//$scope.com是undefined，需要$watch来监控com的值，当com有值时再执行函数
			$scope.$watch('com',function(newVal, oldVal, scope){
				if(newVal)$scope.showPositionList(0);
			})
			
		}
	}
}])
angular.module('app').directive('appPositionInfo',['$http',function($http){
	return {
		restrict : 'A',
		replace : true,
		templateUrl: '../view/template/positionInfo.html',
		scope : {
			isLogin: '=',
			pos: '='
		},
		link : function(scope){
			// scope.$watch('pos',function(newVal){
			// 	console.log(111111)
			// 	if(newVal){
			// 		scope.pos.select  = scope.pos.select || false;
			// 		scope.imagePath = scope.pos.select?'image/star-active.png':'image/star.png';
			// 	}
			// })
			
			scope.favorite = function(){
				console.log(scope.pos)
				$http.post('data/favorite.json',{
					id: scope.pos.id,
					select: !scope.pos.select
				}).then(function(res){
					scope.pos.select  = !scope.pos.select;
					scope.imagePath = scope.pos.select?'image/star-active.png':'image/star.png';
				})
			}
		}
		
	}
}])
angular.module('app').directive('appPositionList',['$http',function($http){
	return {
		restrict : 'A',
		replace : true,
		templateUrl: '../view/template/positionList.html',
		scope : {
			data : '=',
			filterObj : '=',
			isFavorite: '='
		},
		link : function(scope){
			scope.select = function(item){
				$http.post('data/favorite.json',{id:item.id,select:!item.select}).then(function(res){
					item.select = !item.select;
				})

			}
		}
	}
}])
angular.module('app').directive('appSheet',[ function(){
	return {
		restrict : 'A',
		replace: true,
		templateUrl : '../view/template/sheet.html',
		scope: {
			list: '=',
			visible: '=',
			select: '&'
		}
	}
}])
angular.module('app').directive('appTab', [function(){
	return {
		restrict : 'A',
		replace: true,
		templateUrl : '../view/template/tab.html',
		scope:{
			tabClick: '&',
			list: '='
		},
		link : function(scope){
			scope.click = function(tab){
				scope.selectId = tab.id;
				scope.tabClick(tab);
			}
		}
	}
}])
angular.module('app').filter('filterByObj',[function(){
	return function(list, obj){
		var result = [];
		angular.forEach(list, function(item){
			var isEqual = true;
			for(var e in obj){
				if(item[e]!==obj[e]){
					isEqual = false;
				}
			}
			if(isEqual){
				result.push(item);
			}
		})
		return result;
	}
}])