"use strict";angular.module("app",["ui.router","ngCookies","validation","ngAnimate"]),angular.module("app").value("dict",{}).run(["$http","dict",function(t,e){t.get("data/city.json").then(function(t){e.city=t.data}),t.get("data/salary.json").then(function(t){e.salary=t.data}),t.get("data/scale.json").then(function(t){e.scale=t.data})}]),angular.module("app").config(["$provide",function(t){t.decorator("$http",["$delegate","$q",function(t,e){var a=t.get;return t.post=function(t,n,o){var i=e.defer();return a(t).then(function(t){i.resolve(t)}).catch(function(t){i.reject(t)}),{then:function(t){i.promise.then(t)},catch:function(t){i.promise(null,t)}}},t}])}]),angular.module("app").config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("main",{url:"/main",templateUrl:"../../view/main.html",controller:"mainCtrl"}).state("position",{url:"/position/:id",templateUrl:"../../view/position.html",controller:"positionCtrl"}).state("company",{url:"/company/:id",templateUrl:"../../view/company.html",controller:"companyCtrl"}).state("search",{url:"/search/",templateUrl:"../../view/search.html",controller:"searchCtrl"}).state("login",{url:"/login/",templateUrl:"../../view/login.html",controller:"loginCtrl"}).state("register",{url:"/register/",templateUrl:"../../view/register.html",controller:"registerCtrl"}).state("favorite",{url:"/favorite/",templateUrl:"../../view/favorite.html",controller:"favoriteCtrl"}).state("post",{url:"/post/",templateUrl:"../../view/post.html",controller:"postCtrl"}).state("me",{url:"/me/",templateUrl:"../../view/me.html",controller:"meCtrl"}),e.otherwise("main")}]),angular.module("app").config(["$validationProvider",function(t){var e={phone:/^1[\d]{10}$/,password:function(t){return(t+"").length>5},required:function(t){return!!t}},a={phone:{success:"",error:"必须是11位手机号"},password:{success:"",error:"长度至少6位"},required:{success:"",error:"不能为空"}};t.setExpression(e).setDefaultMsg(a)}]),angular.module("app").controller("companyCtrl",["$scope","$http","$state","cache",function(t,e,a,n){n.set("abc","123"),console.log(n.get("abc")),e.get("/data/company.json?id="+a.params.id).then(function(e){t.company=e.data})}]),angular.module("app").controller("favoriteCtrl",["$scope","$http",function(t,e){e.get("data/myFavorite.json").then(function(e){t.list=e.data})}]),angular.module("app").controller("loginCtrl",["$scope","$http","$state","cache",function(t,e,a,n){t.submit=function(){e.post("data/login.json",t.user).then(function(t){n.set("id",t.data.id),n.set("name",t.data.name),n.set("image",t.data.image),a.go("main")})}}]),angular.module("app").controller("mainCtrl",["$http","$scope",function(t,e){t.get("/data/positionList.json").then(function(t){console.log(t),e.list=t.data})}]),angular.module("app").controller("meCtrl",["$scope","cache","$state",function(t,e,a){e.get("name")&&(t.image=e.get("image"),t.name=e.get("name")),t.logout=function(){e.remove("id"),e.remove("name"),e.remove("image"),a.go("main")}}]),angular.module("app").controller("positionCtrl",["$scope","$http","$state","$q","cache",function(t,e,a,n,o){function i(a){e.get("/data/company.json?id="+a).then(function(e){t.company=e.data})}t.isLogin=!!o.get("name"),t.message=t.isLogin?"投个简历":"去登陆",function(){var o=n.defer();return e.get("/data/position.json?id="+a.params.id).then(function(e){t.position=e.data,t.posted&&(t.message="已投递"),o.resolve(e.data)}).catch(function(t){o.reject(t)}),o.promise}().then(function(t){i(t.companyId)}),t.go=function(){"已投递"!==t.message&&(t.isLogin?e.post("data/handle.json",{id:t.position.id}).then(function(e){console.log(e.data),t.message="已投递"}):a.go("login"))}}]),angular.module("app").controller("postCtrl",["$scope","$http",function(t,e){t.tabList=[{id:"all",name:"全部"},{id:"pass",name:"面试邀约"},{id:"fail",name:"不合适"}],e.get("data/myPost.json").then(function(e){t.positionList=e.data}),t.filterObj={},t.tClick=function(e,a){switch(e){case"all":delete t.filterObj.state;break;case"pass":t.filterObj.state="1";break;case"fail":t.filterObj.state="-1"}}}]),angular.module("app").controller("registerCtrl",["$scope","$http","$interval","$state",function(t,e,a,n){t.submit=function(){e.post("data/regist.json",t.user).then(function(t){n.go("login")})},t.send=function(){var n=60;e.get("data/code.json").then(function(e){if(1===e.data.state){t.time="60s";var o=a(function(){if(n<=0)return a.cancel(o),void(t.time="重新发送");n--,t.time=n+"s"},1e3)}})}}]),angular.module("app").controller("searchCtrl",["$scope","$http","dict",function(t,e,a){t.name="",t.search=function(){e.get("data/positionList.json?name="+t.name).then(function(e){t.positionList=e.data})},t.search(),t.sheet={},t.tabList=[{id:"city",name:"城市"},{id:"salary",name:"薪资"},{id:"scale",name:"公司规模"}];var n="";t.filterObj={},t.tClick=function(e){n=e,t.sheet.list=a[e],t.sheet.visible=!0},t.sClick=function(e,a){console.log(e),e?(angular.forEach(t.tabList,function(t){t.id===n&&(t.name=a)}),t.filterObj[n+"Id"]=e,console.log(t.filterObj)):(delete t.filterObj[n+"Id"],angular.forEach(t.tabList,function(t){if(t.id===n)switch(t.id){case"city":t.name="城市";break;case"salary":t.name="薪资";break;case"scale":t.name="公司规模"}}))}}]),angular.module("app").service("cache",["$cookies",function(t){this.set=function(e,a){t.put(e,a)},this.get=function(e){return t.get(e)},this.remove=function(e){t.remove(e)}}]),angular.module("app").directive("appCompany",[function(){return{restrict:"A",replace:!0,templateUrl:"../view/template/company.html",scope:{com:"="}}}]),angular.module("app").directive("appFoot",[function(){return{restrict:"A",replace:!0,templateUrl:"../view/template/foot.html"}}]),angular.module("app").directive("appHead",["cache",function(t){return{restrict:"A",replace:!0,templateUrl:"../view/template/head.html",link:function(e){e.name=t.get("name")}}}]),angular.module("app").directive("appHeadBar",[function(){return{restrict:"A",replace:!0,templateUrl:"../view/template/headBar.html",scope:{text:"@"},link:function(t,e,a){t.back=function(){window.history.back()}}}}]),angular.module("app").directive("appPositionClass",[function(){return{restrict:"A",replace:!0,templateUrl:"../view/template/positionClass.html",scope:{com:"="},link:function(t,e,a){t.showPositionList=function(e){t.isClick++,t.positionList=t.com.positionClass[e].positionList,t.isActive=e},t.$watch("com",function(e,a,n){e&&t.showPositionList(0)})}}}]),angular.module("app").directive("appPositionInfo",["$http",function(t){return{restrict:"A",replace:!0,templateUrl:"../view/template/positionInfo.html",scope:{isLogin:"=",pos:"="},link:function(e){e.favorite=function(){console.log(e.pos),t.post("data/favorite.json",{id:e.pos.id,select:!e.pos.select}).then(function(t){e.pos.select=!e.pos.select,e.imagePath=e.pos.select?"image/star-active.png":"image/star.png"})}}}}]),angular.module("app").directive("appPositionList",["$http",function(t){return{restrict:"A",replace:!0,templateUrl:"../view/template/positionList.html",scope:{data:"=",filterObj:"=",isFavorite:"="},link:function(e){e.select=function(e){t.post("data/favorite.json",{id:e.id,select:!e.select}).then(function(t){e.select=!e.select})}}}}]),angular.module("app").directive("appSheet",[function(){return{restrict:"A",replace:!0,templateUrl:"../view/template/sheet.html",scope:{list:"=",visible:"=",select:"&"}}}]),angular.module("app").directive("appTab",[function(){return{restrict:"A",replace:!0,templateUrl:"../view/template/tab.html",scope:{tabClick:"&",list:"="},link:function(t){t.click=function(e){t.selectId=e.id,t.tabClick(e)}}}}]),angular.module("app").filter("filterByObj",[function(){return function(t,e){var a=[];return angular.forEach(t,function(t){var n=!0;for(var o in e)t[o]!==e[o]&&(n=!1);n&&a.push(t)}),a}}]);