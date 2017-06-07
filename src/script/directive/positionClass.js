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