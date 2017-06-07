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