var app = angular.module('ChatApp', []);

app.controller('MainCtrl', function($scope, $sce, net, tools, messageParser, sounds){

	$scope.rooms = {};
	$scope.me = {
		login: 'u172144439'
	}

	var activeRoom;
	var nicks = {};
	var roomsIndex = 0;
	var myLogin = 'u172144439';

	var hitagi = new net.start('aniavatars.com:8080');

	hitagi.bind('open', function(data){
		hitagi.auth();
	});

	hitagi.bind('vkauth', function(data){

		$scope.me = {
			login: data.login,
			nick: data.nickname,
			state: data.state,
			avaurl: data.url,
			statustext: data.statustext,
			commpriv: data.privilege,
			textcolor: data.textcolor,
			messcount: 1234
		}
		$scope.$apply();

		hitagi.join('gruppa_s_');
		//hitagi.join('public');
	});


	hitagi.bind('chat', function(data){

		$scope.rooms[data.r].messages.push({
			u: data.u,
			t: messageParser.parse(data.t),
			n: nicks[data.u],
			d: tools.timestamp()
		});
		$scope.$apply();

		if(data.u != myLogin) sounds.play('message');

	});

	hitagi.bind('joinroom', function(data){

		roomsIndex++;
		$scope.rooms[data.name] = data;
		$scope.rooms[data.name].index = roomsIndex;
		$scope.rooms[data.name].type = 'room';
		$scope.rooms[data.name].nmFlag = 0;

		for (var j in data.messages) {
			$scope.rooms[data.name].messages[j].t = messageParser.parse(data.messages[j].t);
		}


		$scope.$apply();
		activeRoom = data.name;

		for (var i in data.users) {
			nicks[i] = data.users[i].nick;
		}

		tools.selectRoom(activeRoom);

	});

	hitagi.bind('userjoined', function(data){

		$scope.rooms[data.room].users[data.name] = data.data;
		nicks[data.name] = data.data.nick;

		$scope.rooms[data.room].messages.push({
			u: '',
			t: tools.tpl('userjoined', nicks[data.name]),
			n: '',
			d: tools.timestamp(),
			cls: {green: true}
		});

		$scope.$apply();

	});

	hitagi.bind('userleaved', function(data){

		delete $scope.rooms[data.room].users[data.name];

		$scope.rooms[data.room].messages.push({
			u: '',
			t: tools.tpl('userleaved', nicks[data.name]),
			n: '',
			d: tools.timestamp(),
			cls: {red: true}
		});

		$scope.$apply();

	});

	hitagi.bind('leaveroom', function(data){
		delete $scope.rooms[data.room];
		$scope.$apply();

		activeRoom = tools.getFirst($scope.rooms);
		tools.selectRoom(activeRoom);
	});

	hitagi.bind('getmessages', function(data){

		var roomName = 'pm-' + data.user.login;
		var users = {};

		users[data.user.login] = data.user;
		users[myLogin] = $scope.me;

		roomsIndex++;
		$scope.rooms[roomName] = {
			messages: data.messages,
			index: roomsIndex,
			caption: '@' + data.user.nick,
			name: roomName,
			user: data.user.login,
			type: 'pm',
			users: users
		}
		$scope.$apply();
		activeRoom = roomName;

		nicks[data.user.login] = data.user.nick;

		tools.selectRoom(activeRoom);

	});

	hitagi.bind('recmess', function(data){

		var room;

		if(data.u == myLogin) {
			room = 'pm-' + data.r;
		} else {
			room = 'pm-' + data.u;
		}


		if($scope.rooms[room]) {
			// вкладка уже создана

			$scope.rooms[room].messages.push({
				u: data.u,
				t: data.t,
				n: data.n,
				d: data.d
			});

			$scope.$apply();

		} else {
			// надо создать вкладку
			hitagi.getMessages(data.u);
		}


	});

	hitagi.bind('setstate', function(data){

		var user;
		for(var i in $scope.rooms) {
			user = $scope.rooms[i].users[data.user];
			if(user) {

				user.state = data.val;

				$scope.rooms[i].messages.push({
					u: '',
					t: tools.tpl('setstate', [nicks[data.user], tools.getStateText(data.val), tools.getStateUrl(data.val)]),
					n: '',
					d: tools.timestamp(),
					cls: {blue: true}
				});

			}
		}
		$scope.$apply();

	});
	hitagi.bind('setstatus', function(data){

		var user;
		for(var i in $scope.rooms) {
			user = $scope.rooms[i].users[data.user];
			if(user) {
				user.statustext = data.text;

				$scope.rooms[i].messages.push({
					u: '',
					t: tools.tpl('setstus', [nicks[data.user], data.text]),
					n: '',
					d: tools.timestamp(),
					cls: {blue: true}
				});

			}
		}

		$scope.$apply();

	});





	$scope.tabClick = function(tab){
		activeRoom = tab;
		tools.selectRoom(tab);
	}
	$scope.enterText = function(text){

		if(!activeRoom) return;

		if($scope.rooms[activeRoom].type == 'room') {
			hitagi.chat(text, activeRoom);
			$scope.me.messcount++;
		} else {
			hitagi.sendMess($scope.rooms[activeRoom].user, text);
		}
	}
	$scope.closeRoom = function(room){

		if($scope.rooms[activeRoom].type == 'room') {
			hitagi.leaveRoom(activeRoom);
		}

		delete $scope.rooms[activeRoom];
		$scope.$apply();

		activeRoom = tools.getFirst($scope.rooms);
		tools.selectRoom(activeRoom);


	}

	$scope.messageHtml = function(m) {
		return $sce.trustAsHtml(m);
	}


	$scope.addroom = function(){
		hitagi.join('public');
	}


	$scope.tools = tools;

	$scope.messagesForms = {
		0: 'Нет сообщений',
		one: '{} сообщение',
		few: '{} сообщения',
		many: '{} сообщений',
		other: '{} сообщений'
	}

	$('.fancy-pic').fancybox();

});




