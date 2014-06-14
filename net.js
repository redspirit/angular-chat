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

				self.trigger('auth');

			},
			joinroom: function(msg) {
				if (msg.status == 'ok'){
					delete msg.type;
					delete msg.status;
					self.trigger('joinroom', msg);
				} else {
					console.log('ERROR:', msg.reason);
				}
			},
			chat: function(msg) {

				self.trigger('chat', msg);

			},
			userjoined: function(msg) {
				self.trigger('userjoined', msg);
			},
			userleaved: function(msg) {
				self.trigger('userleaved', msg);
			},
			leaveroom: function(msg) {
				self.trigger('leaveroom', msg);
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

		this.leaveRoom = function(room){

			self.send({
				room: room,
				type:'leaveroom'
			});

		}

	}









	MicroEvent.mixin(Start);
	return {
		start: Start
	}
});