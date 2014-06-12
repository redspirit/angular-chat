var app = angular.module('ChatApp', []);

app.controller('MainCtrl', function($scope, $sce, jq, net, tools){

	var activeRoom;
	var nicks = {};

	var hitagi = new net.start('aniavatars.com:8080');

	hitagi.bind('open', function(data){
		hitagi.auth();
	});

	hitagi.bind('auth', function(data){
		hitagi.join('public');
	});


	hitagi.bind('chat', function(data){

		$scope.rooms[activeRoom].messages.push({
			u: data.u,
			t: data.t,
			n: nicks[data.u]
		});
		$scope.$apply();

	});

	hitagi.bind('joinroom', function(data){

		$scope.rooms[data.name] = data;
		$scope.$apply();
		activeRoom = data.name;

		for (var i in data.users) {
			nicks[i] = data.users[i].nick;
		}

		console.log(nicks);

	});


	$scope.rooms = {};


	$scope.tabClick = function(tab){
		jq.$('.tabs-inset > li').removeClass('active-tab');
		jq.$('#tab-'+tab).addClass('active-tab');

		jq.$('.tabs-content > div').hide();
		jq.$('#tabcont-'+tab).show();

		activeRoom = tab;

	}
	$scope.enterText = function(text){

		if(!activeRoom) return;

		hitagi.chat(text, activeRoom);

	}

	$scope.messageHtml = function(m){
		return $sce.trustAsHtml(m);
	}






});

app.service('jq', function(){
	return {
		$: function(query) {
			var elem = angular.element(document.querySelectorAll(query));
			elem.show = function() {
				elem.css('display', 'block');
			};
			elem.hide = function() {
				elem.css('display', 'none');
			};
			return elem;
		}
	}
});


app.service('tools', function(){
	return {
		json_merge: function (json1, json2){
			var out = {};
			for(var k1 in json1){
				if (json1.hasOwnProperty(k1)) out[k1] = json1[k1];
			}
			for(var k2 in json2){
				if (json2.hasOwnProperty(k2)) {
					if(!out.hasOwnProperty(k2)) out[k2] = json2[k2];
					else if(
						(typeof out[k2] === 'object') && (out[k2].constructor === Object) &&
							(typeof json2[k2] === 'object') && (json2[k2].constructor === Object)
						) out[k2] = json_merge_recursive(out[k2], json2[k2]);
				}
			}
			return out;
		}
	}
});

app.directive('ngEnter', function() {
	return function($scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13 && $scope.messageText) {
				$scope.enterText($scope.messageText);
				$scope.$apply();
				element.val('');
				$scope.messageText = '';
				event.preventDefault();
			}
		});
	}
});