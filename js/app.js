var app = angular.module('ChatApp', []);
var chatName = 'Хитаги чат 3';
var activeRoom;
var chatFocused = true;
var hitagi;

app.controller('MainCtrl', function($scope, $sce, net, tools, messageParser, sounds){

	var currentPosModal = 0;
	$scope.rooms = {};
	$scope.me = {
		login: 'u172144439',
		state: 0
	}

	var nicks = {};
	var roomsIndex = 0;
	var myLogin = 'u172144439';

	hitagi = new net.start('aniavatars.com:8080');

	hitagi.bind('open', function(data){
		hitagi.auth();
	});

	hitagi.bind('error', function(data){
		$scope.showErrorNotify(data);
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
			t: data.t,
			n: nicks[data.u],
			d: tools.timestamp()
		});
		if(data.r != activeRoom || !chatFocused) $scope.rooms[data.r].unread++;
		tools.checkUnreads($scope.rooms);

		if(!chatFocused && $scope.rooms[data.r].last_mess === 0) {
			var lastIndex = $scope.rooms[data.r].messages.length - 2;
			$scope.rooms[data.r].messages[lastIndex].last = 1;
			$scope.rooms[data.r].last_mess = lastIndex;
		}

		$scope.$apply();

		if(data.u != myLogin) sounds.play('chat');

	});
	hitagi.bind('joinroom', function(data){

		roomsIndex++;
		$scope.rooms[data.name] = data;
		$scope.rooms[data.name].index = roomsIndex;
		$scope.rooms[data.name].type = 'room';
		$scope.rooms[data.name].unread = 0;
		$scope.rooms[data.name].last_mess = 0;

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
			cls: {green: true},
			sys: 1
		});

		sounds.play('user_joined');
		$scope.$apply();

	});
	hitagi.bind('userleaved', function(data){

		delete $scope.rooms[data.room].users[data.name];

		$scope.rooms[data.room].messages.push({
			u: '',
			t: tools.tpl('userleaved', nicks[data.name]),
			n: '',
			d: tools.timestamp(),
			cls: {red: true},
			sys: 1
		});

		sounds.play('user_leave');
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
			users: users,
			unread: 0,
			last_mess: 0
		}
		$scope.$apply();
		activeRoom = roomName;

		nicks[data.user.login] = data.user.nick;

		tools.selectRoom(activeRoom);

	});
	hitagi.bind('recmes', function(msg){

		var room;
		var data = msg.message;

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
			if(room != activeRoom || !chatFocused) $scope.rooms[room].unread++;
			tools.checkUnreads($scope.rooms);
			$scope.$apply();

		} else {
			// надо создать вкладку
			hitagi.getMessages(data.u);
		}

		sounds.play('chat');

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
					cls: {blue: true},
					sys: 1
				});

			}
		}
		$scope.$apply();
		sounds.play('event');

	});
	hitagi.bind('setstatus', function(data){

		var user;
		for(var i in $scope.rooms) {
			user = $scope.rooms[i].users[data.user];
			if(user) {
				user.statustext = data.text;

				$scope.rooms[i].messages.push({
					u: '',
					t: tools.tpl('setstatus', [nicks[data.user], data.text]),
					n: '',
					d: tools.timestamp(),
					cls: {blue: true},
					sys: 1
				});

			}
		}

		$scope.$apply();
		sounds.play('event');

	});
	hitagi.bind('getprofile', function(data){

		var prof = data.userdata;
		var profArr = [];
		if(prof.gender == 1) prof.gender = 'Мальчик';
		if(prof.gender == 2) prof.gender = 'Девочка';

		for (var i in prof) {
			if(prof[i]) profArr.push(prof[i]);
		}

		$scope.posmodal.title = prof.nickname;
		$scope.posmodal.content = profArr.join('<br />');
		$scope.$apply();

		$scope.posModalShow(currentPosModal);

	});
	hitagi.bind('settopic', function(data){
		$scope.rooms[data.room].messages.push({
			u: '',
			t: tools.tpl('settopic', data.topic),
			n: '',
			d: tools.timestamp(),
			cls: {},
			sys: 1
		});
		$scope.$apply();
		sounds.play('event');
	});
	hitagi.bind('setavatar', function(data){
		var user;
		for(var i in $scope.rooms) {
			user = $scope.rooms[i].users[data.user];
			if(user) {
				user.avaurl = data.newnick;
				$scope.rooms[i].messages.push({
					u: '',
					t: tools.tpl('setavatar', [nicks[data.user], data.url]),
					n: '',
					d: tools.timestamp(),
					cls: {green: true},
					sys: 1
				});
			}
		}
		$scope.$apply();
		sounds.play('event');
	});
	hitagi.bind('setnick', function(data){
		var user;
		for(var i in $scope.rooms) {
			user = $scope.rooms[i].users[data.user];
			if(user) {
				user.nick = data.newnick;
				$scope.rooms[i].messages.push({
					u: '',
					t: tools.tpl('setnick', [nicks[data.user], data.newnick]),
					n: '',
					d: tools.timestamp(),
					cls: {green: true},
					sys: 1
				});
			}
		}
		$scope.$apply();
		sounds.play('event');
	});
	hitagi.bind('gethistory', function(data){

		if(data.messages.length > 0) {
			$scope.rooms[activeRoom].messages = data.messages.reverse().concat($scope.rooms[activeRoom].messages);
			$scope.$apply();
			sounds.play('history_load');
		}

	});



	/***********************************************************************************************************/


	$scope.tabClick = function(tab){
		activeRoom = tab;
		$scope.rooms[tab].unread = 0;
		tools.selectRoom(tab);
	}
	$scope.enterText = function(text){

		if(!activeRoom) return;

		if($scope.rooms[activeRoom].type == 'room') {

			var lastmess = $scope.rooms[activeRoom].last_mess;
			if(lastmess > 0) {
				$scope.rooms[activeRoom].messages[lastmess].last = 0;
				$scope.rooms[activeRoom].last_mess = 0;
			}

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


    // todo использовать только поле bot
    $scope.showNick = function(mess) {
        if(mess.bot || mess.isbot) {
            return '';
        } else {
            return mess.n;
        }
    }
	$scope.messageHtmlParse = function(mess) {
        if(mess.sys || mess.bot || mess.isbot) {
            return $sce.trustAsHtml(mess.t);
        } else {
            return $sce.trustAsHtml(messageParser.parse(mess.t));
        }
	}
	$scope.messageHtml = function(m) {
		return $sce.trustAsHtml(m);
	}


	$scope.addroom = function(){
		hitagi.join('public');
	}
	$scope.soundClick = function(){
		soundEnabled = !soundEnabled;
		$scope.toolpanel.soundCls = {'sound-on': soundEnabled, 'sound-off':!soundEnabled}
	}
	$scope.notifClick = function(){
		notifEnabled = !notifEnabled;
		$scope.toolpanel.notifCls = {'notif-on': notifEnabled, 'notif-off': !notifEnabled}
	}


	var soundEnabled = true;
	var notifEnabled = true;

	$scope.tools = tools;

	$scope.toolpanel = {
		soundCls: {'sound-on': soundEnabled, 'sound-off': !soundEnabled},
		notifCls: {'notif-on': notifEnabled, 'notif-off': !notifEnabled}
	};

	$scope.messagesForms = {
		0: 'Нет сообщений',
		one: '{} сообщение',
		few: '{} сообщения',
		many: '{} сообщений',
		other: '{} сообщений'
	}

	$scope.testAction = function(){
		var msgs = $scope.rooms[activeRoom].messages;
		var count = 0;
		for (var i in msgs) {
			if(!msgs[i].sys) {
				count++;
			}
		}

		hitagi.getHistory(activeRoom, count);

	}

	$scope.requestUserProfile = function(user, top) {
		if($scope.posmodal.state) return;
		currentPosModal = top;
		hitagi.getProfile(user);
	}



	$('.fancy-pic').fancybox();

});




