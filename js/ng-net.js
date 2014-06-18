/**
 * Created with JetBrains PhpStorm.
 * User: Spirit
 * Date: 12.06.14
 * Time: 14:53
 */

app.service('net', function(){
	var ws;

	var Start = function(server) {

		var self = this;
		ws = new WebSocket('ws://' + server);


		var ways = {
			vkauth: function(msg) {

				self.trigger('auth', msg);

			},
			joinroom: function(msg) {
				if (msg.status == 'ok'){
					delete msg.type;
					delete msg.status;
					self.trigger('joinRoom', msg);
				} else {
					console.log('ERROR:', msg.reason);
				}
			},
			chat: function(msg) {

				self.trigger('chat', msg);

			},
			userjoined: function(msg) {
				self.trigger('userJoined', msg);
			},
			userleaved: function(msg) {
				self.trigger('userLeaved', msg);
			},
			leaveroom: function(msg) {
				self.trigger('leaveRoom', msg);
			},
			getmessages: function(msg) {
				if (msg.status == 'ok'){
					delete msg.type;
					delete msg.status;
					self.trigger('getMessages', msg);
				} else {
					console.log('ERROR:', msg.reason);
				}
			},
			recmes: function(msg) {
				self.trigger('newMess', msg.message);
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
		this.sendMess = function(user, text){
			self.send({
				text: text,
				to: user,
				cl: '',
				type:'sendmess'
			});
		}
		this.getMessages = function(user){
			self.send({
				from: user,
				count: 30,
				type:'getmessages'
			});
		}

	}









	MicroEvent.mixin(Start);
	return {
		start: Start
	}
});