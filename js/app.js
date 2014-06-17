var app = angular.module('ChatApp', []);

app.controller('MainCtrl', function($scope, $sce, net, tools, messageParser){

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

	hitagi.bind('auth', function(data){
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

		hitagi.join('public');
	});


	hitagi.bind('chat', function(data){

		$scope.rooms[data.r].messages.push({
			u: data.u,
			t: messageParser.parse(data.t),
			n: nicks[data.u],
			d: tools.timestamp()
		});
		$scope.$apply();

		tools.toBottom(data.r);

	});

	hitagi.bind('joinRoom', function(data){

		roomsIndex++;
		$scope.rooms[data.name] = data;
		$scope.rooms[data.name].index = roomsIndex;
		$scope.rooms[data.name].type = 'room';

		for (var j in data.messages) {
			$scope.rooms[data.name].messages[j].t = messageParser.parse(data.messages[j].t);
		}


		$scope.$apply();
		activeRoom = data.name;

		for (var i in data.users) {
			nicks[i] = data.users[i].nick;
		}

		tools.selectRoom(activeRoom);
		tools.toBottom(activeRoom);

	});

	hitagi.bind('userJoined', function(data){

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

	hitagi.bind('userLeaved', function(data){

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

	hitagi.bind('leaveRoom', function(data){
		delete $scope.rooms[data.room];
		$scope.$apply();

		activeRoom = tools.getFirst($scope.rooms);
		tools.selectRoom(activeRoom);
	});

	hitagi.bind('getMessages', function(data){

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
		tools.toBottom(activeRoom);

	});

	hitagi.bind('newMess', function(data){

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
			tools.toBottom(room);

		} else {
			// надо создать вкладку
			hitagi.getMessages(data.u);
		}


	});



	$scope.tabClick = function(tab){
		activeRoom = tab;
		tools.selectRoom(tab);
		tools.toBottom(tab);
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
		hitagi.join('gruppa_s_');
		$scope.modal.visible = 1;
	}


	$scope.modal = {
        template: 'templates/blank.html',
		visible: 0
	}
	$scope.modalClose = function(){
		$scope.modal.visible = 0;
	}



	$scope.editProfile = function() {
		$scope.modal.template = 'templates/edit_profile.html';
		$scope.modal.visible = 1;
	}
	$scope.setAvatar = function() {
		$scope.modal.template = 'templates/set_avatar.html';
		$scope.modal.visible = 1;
	}

	$scope.countObj = tools.countObj;


	$('.fancy-pic').fancybox();


});




