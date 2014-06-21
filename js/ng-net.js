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


		ws.onopen = function() {
			self.trigger('open');
		}
		ws.onclose = function() {
			self.trigger('close');
		}
		ws.onmessage = function(e) {
			var msg = JSON.parse(e.data);
			var tp = msg.type;

            if(msg.status != 'error') {
                delete msg.type;
                delete msg.status;
                self.trigger(tp, msg);
            } else {
                console.log('ERROR [' + msg.type + ']: ' + msg.reason);
            }

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

        this.setState = function(state){
            self.send({
                val: state,
                type:'setstate'
            });
        }
        this.setStatus = function(status){
            self.send({
                text: status,
                type:'setstatus'
            });
        }
        this.setTopic = function(room, topic){
            self.send({
                room: room,
                topic: topic,
                type:'settopic'
            });
        }
        this.setAvatar = function(user){
            self.send({


                type:'setavatar'
            });
        }
		this.getProfile = function(user){
			self.send({
				user: user,
				type:'getprofile'
			});
		}


	}









	MicroEvent.mixin(Start);
	return {
		start: Start
	}
});