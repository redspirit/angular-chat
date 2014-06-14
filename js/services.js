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