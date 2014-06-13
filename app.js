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
			n: nicks[data.u],
			d: tools.timestamp()
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

	});

	hitagi.bind('userjoined', function(data){

		$scope.rooms[data.room].users[data.name] = data.data;
		nicks[data.name] = data.data.nick;

		$scope.rooms[data.room].messages.push({
			u: '',
			t: '<b>' + nicks[data.name] + '</b> зашел в комнату',
			n: '',
			d: tools.timestamp(),
			cls: {green: true}
		});

		$scope.$apply();

	});

	hitagi.bind('userleaved', function(data){

		$scope.rooms[data.room].users[data.name] = undefined;

		$scope.rooms[data.room].messages.push({
			u: '',
			t: '<b>' + nicks[data.name] + '</b> вышел из комнаты',
			n: '',
			d: tools.timestamp(),
			cls: {red: true}
		});

		$scope.$apply();

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

	$scope.messageHtml = function(m) {
		return $sce.trustAsHtml(m);
	}
	$scope.timeFormat = tools.timeFormat;
	$scope.dateFormat = tools.dateFormat;



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
	var addZero = function(n){
		return n < 10 ? '0' + n.toString() : n.toString();
	}
	return {
		timestamp: function() {
			return Math.round(new Date().valueOf() / 1000);
		},
		dateFormat: function(date) {
			var d = new Date(date * 1000);
			return addZero(d.getDate()) + '.' + addZero(d.getMonth() + 1) + '.' + d.getFullYear() + ' '
				+ addZero(d.getHours()) + ':' + addZero(d.getMinutes());
		},
		timeFormat: function(date) {
			var d = new Date(date * 1000);
			return addZero(d.getHours()) + ':' + addZero(d.getMinutes());
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