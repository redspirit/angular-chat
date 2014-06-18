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
		countObj: function(obj) {
			var count = 0;
			for (var i in obj) {
				count++;
			}
			return count;
		},
		selectRoom: function(room) {
			$('.tabs-inset > li').removeClass('active-tab');
			$('#tab-'+room).addClass('active-tab');
			$('.tabs-content > div').hide();
			$('#tabcont-'+room).show();
		}
	}
});


app.service('sounds', function(){

	var audio = new Audio();
	var canPlayMp3 = !!audio.canPlayType && audio.canPlayType('audio/mp3') != "";
	var canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"') != "";
	var map = {
		's1':'sounds/alert_26',
		's2':'sounds/alert_36',
		'message':'sounds/alert_asterisk_13'
	}

	var ext;
	var volume;

	if(canPlayMp3) {
		ext = 'mp3';
	} else if (canPlayOgg) {
		ext = 'ogg';
	} else {
		ext = '';
	}

	audio.volume = 0.5;
	volume = 0.5;

	this.check = function(){
		return ext;
	}

	this.volume = function(val){
		audio.volume = val;
		volume = val;
	}

	this.mute = function(mode){
		if(mode) {
			audio.volume = 0;
		} else {
			audio.volume = volume;
		}
	}

	this.play = function(name){
		if(!ext) return false;
		var file = map[name];
		if(file) {
			audio.src = file + '.' + ext;
			audio.play();
		}
	}

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

			// смайлы
			s = s.replace(/\*smile(\d+)\*/gm, function(a,b){
				return '<img class="smile" src="smiles/'+b+'.gif" alt="" />';
			});

			return s;

		}
	}
});