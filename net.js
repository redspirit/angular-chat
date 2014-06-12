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


		var ways = {
			vkauth: function(msg) {

				console.log(msg);
				self.trigger('auth');

			},
			joinroom: function(msg) {

				msg.type = undefined;
				msg.status = undefined;

				self.trigger('joinroom', msg);

			},
			chat: function(msg) {

				self.trigger('chat', msg);

			}
		}


		ws.onopen = function() {
			self.trigger('open');
		}
		ws.onclose = function() {
			self.trigger('close');
		}
		ws.onmessage = function(e) {
			var msg = JSON.parse(e.data);
			if(typeof(ways[msg.type])=='function') ways[msg.type](msg);
		}

		this.send = function(data) {
			ws.send(JSON.stringify(data));
		}


		this.auth = function(){

			self.send({
				uid:"172144439",
				hash:"52ca5326622efa74d2e3f6790626bbb4",
				mobile:false,
				client:"Mozilla/5.0",
				type:"vkauth"
			});

		}

		this.join = function(room){

			self.send({
				type:"joinroom",
				room:room,
				count:30
			});

		}

		this.chat = function(text, room){

			self.send({
				room: room,
				text: text,
				cl:"e30ce3",
				type:"chat"
			});

		}

	}









	MicroEvent.mixin(Start);
	return {
		start: Start
	}
});