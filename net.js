/**
 * Created with JetBrains PhpStorm.
 * User: Spirit
 * Date: 12.06.14
 * Time: 14:53
 * To change this template use File | Settings | File Templates.
 */

app.service('net', function(){
	var ws;

	var Start = function(server) {

		var self = this;
		ws = new WebSocket('ws://' + server);

		ws.onopen = function() {
			self.trigger('open');
		}
		ws.onclose = function() {
			self.trigger('close');
		}
		ws.onmessage = function(e) {
			self.trigger('message', e.data);
		}

		this.send = function(str) {

			var obj = JSON.stringify({data: str})
			ws.send(obj);

		}

	}









	MicroEvent.mixin(Start);
	return {
		start: Start
	}
});