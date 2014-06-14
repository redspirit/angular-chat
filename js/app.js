var app = angular.module('ChatApp', []);

var jq = function(query, one) {
	var elem;
	if (one) {
		elem = angular.element(document.querySelector(query));
	} else {
		elem = angular.element(document.querySelectorAll(query));
	}
	elem.show = function() {
		elem.css('display', 'block');
	};
	elem.hide = function() {
		elem.css('display', 'none');
	};
	return elem;
}



app.filter("toArray", function() {
	return function(obj) {
		var result = [];
		angular.forEach(obj, function(val, key) {
			result.push(val);
		});
		return result;
	}
});

app.controller('MainCtrl', function($scope, $sce, net, tools){

	var activeRoom;
	var nicks = {};
	var roomsIndex = 0;

	var hitagi = new net.start('aniavatars.com:8080');

	hitagi.bind('open', function(data){
		hitagi.auth();
	});

	hitagi.bind('auth', function(data){
		hitagi.join('public');
	});


	hitagi.bind('chat', function(data){

		$scope.rooms[data.r].messages.push({
			u: data.u,
			t: data.t,
			n: nicks[data.u],
			d: tools.timestamp()
		});
		$scope.$apply();

		tools.toBottom(data.r);

	});

	hitagi.bind('joinroom', function(data){

		roomsIndex++;
		$scope.rooms[data.name] = data;
		$scope.rooms[data.name].index = roomsIndex;

		$scope.$apply();
		activeRoom = data.name;

		for (var i in data.users) {
			nicks[i] = data.users[i].nick;
		}

		tools.selectRoom(activeRoom);
		tools.toBottom(activeRoom);

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
		tools.toBottom(data.room);

	});

	hitagi.bind('userleaved', function(data){

		delete $scope.rooms[data.room].users[data.name];

		$scope.rooms[data.room].messages.push({
			u: '',
			t: '<b>' + nicks[data.name] + '</b> вышел из комнаты',
			n: '',
			d: tools.timestamp(),
			cls: {red: true}
		});

		$scope.$apply();
		tools.toBottom(data.room);

	});

	hitagi.bind('leaveroom', function(data){
		delete $scope.rooms[data.room];
		$scope.$apply();

		activeRoom = tools.getFirst($scope.rooms);
		tools.selectRoom(activeRoom);
	});

	$scope.rooms = {};


	$scope.tabClick = function(tab){
		activeRoom = tab;
		tools.selectRoom(tab);
		tools.toBottom(tab);
	}
	$scope.enterText = function(text){

		if(!activeRoom) return;

		hitagi.chat(text, activeRoom);

	}
	$scope.closeRoom = function(room){
		hitagi.leaveRoom(room);
	}

	$scope.messageHtml = function(m) {
		return $sce.trustAsHtml(m);
	}


	$scope.addroom = function(){
		hitagi.join('hentachik');
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
		toBottom: function(room) {
			var pan = document.querySelector('#tabcont-' + room + ' .room-messages');
			pan.scrollTop = pan.scrollHeight;
		},
		getFirst: function(obj) {
			for (var i in obj) {
				return i;
			}
			return '';
		},
		selectRoom: function(room) {
			jq('.tabs-inset > li').removeClass('active-tab');
			jq('#tab-'+room, 1).addClass('active-tab');
			jq('.tabs-content > div').hide();
			jq('#tabcont-'+room, 1).show();
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

app.directive('ngTabbutton', function() {
	return function($scope, elem, attrs) {

		elem.find('span').on('click', function() {
			var room = $scope.$eval(attrs.ngTabbutton);
			$scope.closeRoom(room);
		});

	}
});