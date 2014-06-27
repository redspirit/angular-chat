/**
 * Created with JetBrains PhpStorm.
 * User: Spirit
 * Date: 14.06.14
 * Time: 13:58
 */

app.filter("toArray", function() {
	return function(obj) {
		var result = [];
		angular.forEach(obj, function(val, key) {
			result.push(val);
		});
		return result;
	}
});

app.service('tools', function(){

	var titleElem = $('title');

	var states = [];
	var statesT = [];

	var privas = [];
	var privasT = [];

	states[0] = 'online.png'; 		statesT[0] = 'Онлайн';
	states[1] = 'away.png'; 		statesT[1] = 'Отошел';
	states[2] = 'busy.png'; 		statesT[2] = 'Занят';
	states[3] = 'stop.png'; 		statesT[3] = 'Отсутствую';
	states[4] = 'work.png'; 		statesT[4] = 'Работаю';
	states[5] = 'rest.png'; 		statesT[5] = 'Отдыхаю';
	states[6] = 'game.png'; 		statesT[6] = 'Играю';
	states[7] = 'music.png';		statesT[7] = 'Слушаю музыку';
	states[8] = 'films.png';		statesT[8] = 'Смотрю фильм';
	states[9] = 'food.png'; 		statesT[9] = 'Кушаю';
	states[10] = 'coffee.png';		statesT[10] = 'Чай / кофе';
	states[11] = 'home.png';		statesT[11] = 'Дела по дому';
	states[12] = 'read.png';		statesT[12] = 'Читаю';
	states[13] = 'sleep.png';		statesT[13] = 'Сплю';
	states[14] = 'pirat.png';		statesT[14] = 'Пират';

	privas[0] = 'empty.png'; 		privasT[0] = '';
	privas[1] = 'admin.png'; 		privasT[1] = 'Админ';
	privas[2] = 'moder.png'; 		privasT[2] = 'Модератор';
	privas[3] = 'owner.png'; 		privasT[3] = 'Хозяин комнаты';
	privas[4] = 'user.png'; 		privasT[4] = 'Пользователь';
	privas[5] = 'novoice.png';		privasT[5] = 'Без голоса';

	var templates = {
		userjoined: '<b>{1}</b> зашел в комнату',
		userleaved: '<b>{1}</b> вышел из комнаты',
		setstate: '<b>{1}</b> сменил статус на: <b>{2}</b> <img src="{3}" alt="" />',
		setstatus: '<b>{1}</b> сменил статусный текст на: <b>{2}</b>',
		settopic: '<p class="new-topic">Новый топик: <b>{1}</b></p>',
		setavatar: '<b>{1}</b> сменил аватарку <img class="border-ava" src="{2}" alt="" />',
		setnick: '<b>{1}</b> поставил себе новый ник: <b>{2}</b>'
	}


	return {
		tpl: function (tname, vars){
			var template = templates[tname];
			if(typeof vars == 'string') vars = [vars];
			return template.replace(new RegExp('\{(.*?)\}','g'), function(a,b){
				return vars[b-1];
			})
		},
		getStateUrl: function(s) {
			return 'img/states/' + states[parseInt(s)];
		},
		getStateText: function(s) {
			return statesT[parseInt(s)];
		},
		timestamp: function() {
			return Math.round(new Date().valueOf() / 1000);
		},
		getFirst: function(obj) {
			for (var i in obj) {
				return i;
			}
			return '';
		},
		countObj: function(obj) {
			var count = 0;
			for (var i in obj) {
				count++;
			}
			return count;
		},
		selectRoom: function(room) {
			var element = $('#tabcont-' + room + ' .room-messages');
			$('.tabs-inset > li').removeClass('active-tab');
			$('#tab-'+room).addClass('active-tab');
			$('.tabs-content > div').hide();
			$('#tabcont-'+room).show();
			element.animate({ scrollTop: element.prop('scrollHeight')}, 1000);
			titleElem.html(chatName);
		},
		checkUnreads: function(rooms) {
			var count = 0;
			for(var i in rooms) {
				count += rooms[i].unread;
			}
			if(count > 0) {
				titleElem.html('[' + count + '] ' + chatName);
			} else {
				titleElem.html(chatName);
			}
		}
	}
});


app.service('sounds', function(){

	var audio = new Audio();
	var canPlayMp3 = !!audio.canPlayType && audio.canPlayType('audio/mp3') != "";
	var canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"') != "";
	var map = {
		'chat':'sounds/chat',
		'disconnect':'sounds/disconnect',
		'event':'sounds/event',
		'foryou':'sounds/foryou',
		'history_load':'sounds/history_load',
		'user_joined':'sounds/user_joined',
		'user_leave':'sounds/user_leave'
	}

	var ext;
	var mute = false;

	if(canPlayMp3) {
		ext = 'mp3';
	} else if (canPlayOgg) {
		ext = 'ogg';
	} else {
		ext = '';
	}

	audio.volume = 0.5;

	this.check = function(){
		return ext;
	}

	this.volume = function(val){
		audio.volume = val / 100;
	}

	this.mute = function(mode){
		if(mode) {
			mute = true;
		} else {
			mute = false;
		}
	}

	this.play = function(name, force){
		if(!ext) return false;

		if(mute && !force) return false;

		var file = map[name];
		if(file) {
			audio.src = file + '.' + ext;
			audio.play();
		}
	}

});


app.service('notificate', function(){


});


app.service('messageParser', function(){

	var uplRegexp = /^uploadimage\|([a-z0-9:.\/]+)\|([a-z0-9:.\/]+)$/i;
	var linkReg = new RegExp('(https?://)([-a-zA-Zа-яА-Я0-9@:;%!_\+.,~#?&//=/(/)]+)', 'gi');
	var testStr = function (str, pat){
		return new RegExp(pat, 'i').test(str);
	}


	return {
		parse: function(s) {

			if(uplRegexp.test(s)){
				s.replace(uplRegexp, function(a,b,c){
					s = '<a class="fancy-pic" rel="screen" target="_blank" href="' + b + '"><img class="inline-pic" src="' + c + '" alt="" /></a>';
				});
			} else {
				s = s.replace(linkReg, function(link) {

					if(/\.(jpg|jpeg|gif|png)\??.*$/i.test(link)){ // image

						return '<a class="fancy-pic" rel="screen" target="_blank" href="' + link + '"><img class="inline-pic" src="' + link + '" alt="" /></a>';

					} else if(testStr(link, 'htt(p|ps)://(www.)?youtube.com/')){ 	// youtube

						var yt = link.match(/v=([a-zA-Z0-9_-]+)/);
						return '<iframe width="560" height="315" src="http://www.youtube.com/embed/'+yt[1]+'" frameborder="0" allowfullscreen></iframe><a class="close_video" href="#">[X]</a>';

					} else {	// simple link

						return '<a href="'+link+'" target="_blank">'+link+'</a>';

					}

				});
			}

			/* nl2br */
			s = s.replace(/([^>])\n/g, '$1<br />');

			// смайлы *smile-1.45*
			s = s.replace(/\*smile(\d+).(\d+)\*/gm, function(a,b,c){
				return '<img src="smiles/'+b+'/'+c+'.gif" alt="" />';
			});

			return s;

		}
	}
});