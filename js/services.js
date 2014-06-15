/**
 * Created with JetBrains PhpStorm.
 * User: Spirit
 * Date: 14.06.14
 * Time: 13:58
 */

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
					s = '<a target="_blank" href="' + b + '"><img class="inline-pic" src="' + c + '" alt="" /></a>';
				});
			} else {
				s = s.replace(linkReg, function(link) {

					if(/\.(jpg|jpeg|gif|png)\??.*$/i.test(link)){ // image

						return '<a target="_blank" href="' + link + '"><img class="inline-pic" src="' + link + '" alt="" /></a>';

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
				return '<img src="smiles/'+b+'.gif" alt="" />';
			});

			return s;

		}
	}
});