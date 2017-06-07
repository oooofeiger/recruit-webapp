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