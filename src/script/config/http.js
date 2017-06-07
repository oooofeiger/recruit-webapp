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