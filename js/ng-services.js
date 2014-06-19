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

	var smiles = {
		1: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167],
		2: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68],
		3: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
		4: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175],
		5: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38],
		6: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94],
		7: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200]
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
			s = s.replace(/\*smile-(\d+).(\d+)\*/gm, function(a,b,c){
				return '<img src="smiles/'+b+'/'+c+'.gif" alt="" />';
			});

			return s;

		}
	}
});