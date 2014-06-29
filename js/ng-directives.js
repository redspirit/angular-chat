/**
 * Created with JetBrains PhpStorm.
 * User: Spirit
 * Date: 14.06.14
 * Time: 13:57
 */

app.directive('ngEnter', function() {
	return function($scope, element, attrs) {
		$scope.messageText = '';

		element.bind("keydown keypress", function(event) {
			if(event.which === 13 && $scope.messageText) {
				$scope.enterText($scope.messageText);
				$scope.$apply();
				element.val('');
				$scope.messageText = '';
				event.preventDefault();
			}
		});

		$('.tabs-content').on('click', '.m-nick, .profnick', function(){
			var text = ' ' + $(this).html() + ': ';

			$scope.messageText = $scope.messageText + text;
			$scope.$apply();
			element.focus();

		});

	}
});

app.directive('tabButton', function() {
	return function($scope, elem, attrs) {

		elem.find('img').on('click', function() {
			var room = $scope.$eval(attrs.ngTabbutton);
			$scope.closeRoom(room);
		});

	}
});

app.directive('errorNotify', function() {
	return function($scope, elem) {

		$scope.showErrorNotify = function(text) {
			$scope.errorMessage = text;
			$scope.$apply();
			elem.addClass('md-show');
		}

		elem.click(function(){
			elem.removeClass('md-show');
		});

	}
});

app.directive('roomContent', function() {

	var tooltip = $('.dtooltip');

	return function($scope, elem, attrs) {
		var tooltipShow = 0;
		var currentMessId = '';

		elem.find('.roster').perfectScrollbar({'wheelSpeed':10, 'suppressScrollX':true});
		elem.find('.room-messages').perfectScrollbar({'wheelSpeed':10, 'suppressScrollX':true});
		elem.on('mouseenter', '.m-date', function(){
			var em = $(this);
			var text = em.attr('mtitle');
			var top = em.offset().top - 26;
			currentMessId = em.attr('id');

			tooltipShow = 1;

			tooltip.find('span').html(text);
			tooltip.css('top', top+'px');
			tooltip.addClass('md-show');

		});
		elem.on('mousemove', function(e){
			if(e.pageX > 40 && tooltipShow) {
				tooltip.removeClass('md-show');
				tooltipShow = 0;
			}
		});
		tooltip.on('click', 'img', function(){
			if(currentMessId) {
				var room = $scope.rooms[activeRoom];
				for (var i in room.messages) {
					if(room.messages[i].id == currentMessId) {
						$scope.rooms[activeRoom].messages.splice(i,1);
						$('#' + currentMessId).parent().slideUp(300, function(){
							$scope.$apply();
						});
						return false;
					}
				}
			}
		});

	}
});

app.directive('roster', function() {
	return function($scope, elem) {


		$scope.clickOnUserAva = function(user){
			var top = elem.find('.profava[user='+user+']').offset().top;
			$scope.requestUserProfile(user, top);
		}

	}
});

app.directive('posModal', function() {
	return function($scope, elem) {

		$scope.posmodal = {
			title: '',
			content: '',
			state: 0
		}


		$scope.posModalShow = function(top) {
			if($scope.posmodal.state) {
				$scope.posmodal.state = 0;
				elem.removeClass('md-show');
			} else {
				$scope.posmodal.state = 1;
				elem.css('top', top + 'px');
				elem.addClass('md-show');
			}
		}
		$scope.posModalHide = function() {
			$scope.posmodal.state = 0;
			elem.removeClass('md-show');
		}


	}
});

app.directive('autoscrollDown', function () {
    return {
        link: function postLink($scope, element, attrs) {

			var enableAutoscroll = true;
			var forceScroll = true;

			element.scroll(function(e){
				enableAutoscroll = element.prop('offsetHeight') + element.prop('scrollTop') + 15 >= element.prop('scrollHeight');

				if(element.prop('scrollTop')  == 0) {
					$scope.testAction();
				}

			});

			setTimeout(function() {
				forceScroll = false;
			}, 3000);

            $scope.$watch(
                function () {
                    return element.children().length;
                },
                function () {

                    if(enableAutoscroll || forceScroll) {
                        element.animate({ scrollTop: element.prop('scrollHeight')}, 1000);
                    }

					if(forceScroll) setTimeout(function() {
						element.animate({ scrollTop: element.prop('scrollHeight')}, 1000);
					}, 800);

                }
            );
        }
    }
});

app.directive('modalWindow', function () {
    return function($scope, elem) {

		var loadFlag = 0;
		var overlay = $('.overlay');
		var wrap = $('.wrap');
		var oldTpl = '';
        $scope.modalTemplate = 'templates/blank.html';

		$scope.modalLoad = function(){

			if(loadFlag) {
				setTimeout(function() {
					elem.addClass('md-show');
					overlay.addClass('md-show');
					wrap.addClass('blur');
				}, 50);
			}

		}

        $scope.showModal = function(tpl){
			if(loadFlag) return;
			loadFlag = 1;
			var newTpl = 'templates/' + tpl + '.html';
			if(oldTpl == newTpl) {
				elem.addClass('md-show');
				overlay.addClass('md-show');
				wrap.addClass('blur');
			} else {
				$scope.modalTemplate = newTpl;
				oldTpl = newTpl;
			}
        }

        $scope.hideModal = function(){
			loadFlag = 0;
			elem.removeClass('md-show');
			overlay.removeClass('md-show');
			wrap.removeClass('blur');
		}

    }
});

app.directive('wrapBlock', function(tools) {
	return function($scope, elem) {

		window.focus();
		$(window).bind('focus', function() {
			chatFocused = true;
			$scope.rooms[activeRoom].unread = 0;
			$scope.$apply();
			$('title').html(chatName);
		});
		$(window).bind('blur', function() {
			chatFocused = false;
		});

	}
});

app.directive('toolsState', function(tools) {
	return function($scope, elem) {

		$scope.getStateStyle = function(){
			return {'background-image': 'url(img/states/' + tools.states[$scope.me.state] + ')'}
		}

		var menu = '';
		for (var i in tools.states) {
			menu += '<div state="' + i + '"  style="background-image: url(img/states/' + tools.states[i] + ')">' + tools.statesT[i] + '</div>';
		}

		elem.after('<div class="states-menu">' + menu + '</div>');
		var menuElem = $('.states-menu');

		elem.click(function(){
			menuElem.addClass('show-item');
		});
		menuElem.on('mouseleave', function(){
			menuElem.removeClass('show-item');
		});
		menuElem.on('click', 'div', function(){
			var id = parseInt($(this).attr('state'));
			menuElem.removeClass('show-item');

			if($scope.me.state == id) return;

			hitagi.setState(id);
			$scope.me.state = id;
			$scope.$apply();
		});
	}
});

app.directive('toolsStatus', function(tools) {
	return function($scope, elem) {

		elem.after('<div class="statustext-menu"><textarea placeholder="Введите сюда свой статусный текст"></textarea> ' +
			'<input class="cancel-btn" type="button" value="Отмена" /> <input class="ok-btn" type="button" value="Сохранить" /></div>');
		var e = $('.statustext-menu');

		elem.click(function(){
			e.find('textarea').val($scope.me.statustext);
			e.addClass('show-item');
		});
		e.on('click', '.ok-btn', function(){
			var text = e.find('textarea').val();
			e.removeClass('show-item');
			if($scope.me.statustext == text) return;
			hitagi.setStatus(text);
			$scope.me.statustext = text;
		});
		e.on('click', '.cancel-btn', function(){
			e.removeClass('show-item');
		});

	}
});

app.directive('toolsColors', function(tools) {

	var colors = ['000000', '000080', '00008B', '0000CD', '0000FF', '006400', '008000', '008080', '008B8B', '00BFFF',
	 '191970', '1E90FF', '2F4F4F', '4169E1', '4682B4', '483D8B', '4B0082', '556B2F', '696969', '708090', '800000', '8B008B'
		, '8B4513', '9400D3', 'A0522D', 'B8860B', 'C71585', 'D2691E', 'DC143C','ff0178'];

	return function($scope, elem) {

		var oldColor;
		var table = '';
		for (var i in colors) {
			table += '<div class="color-brick" style="background-color: #' + colors[i] + '" code="' + colors[i] + '"></div>';
		}


		elem.after('<div class="colors-menu"><div class="colors-table">' + table + '</div>' +
			'<div><input class="cancel-btn" type="button" value="Отмена" /> <input class="ok-btn" type="button" value="Сохранить" /></div></div>');
		var e = $('.colors-menu');

		elem.click(function(){
			e.addClass('show-item');
			oldColor = $scope.me.myColor;
		});
		e.on('click', '.color-brick', function(){
			var code = $(this).attr('code');

			$scope.me.myColor = code;
			$scope.$apply();

		});
		e.on('click', '.ok-btn', function(){
			e.removeClass('show-item');
		});
		e.on('click', '.cancel-btn', function(){
			e.removeClass('show-item');
			$scope.me.myColor = oldColor;
			$scope.$apply();
		});

		$scope.getMyColor = function(user){

			if($scope.me.login == user) {
				return {
					'color': '#' + $scope.me.myColor
				}
			} else {
				return {};
			}

		}



	}
});

app.directive('toolsSound', function(tools) {
	return function($scope, elem) {

		$scope.soundMode = true;

		$scope.soundClass = function(){
			return {'sound-on': $scope.soundMode, 'sound-off': !$scope.soundMode}
		}

		elem.click(function(){
			$scope.soundMode = !$scope.soundMode;
			$scope.$apply();
		});


	}
});

app.directive('toolsNotif', function(tools) {
	return function($scope, elem) {

		$scope.notifMode = true;

		$scope.notifClass = function(){
			return {'notif-on': $scope.notifMode, 'notif-off': !$scope.notifMode}
		}

		elem.click(function(){
			$scope.notifMode = !$scope.notifMode;
			$scope.$apply();
		});


	}
});

app.directive('toolsSmiles', function() {

	var smiles = {
		1: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
			47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,
			90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,
			125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,
			158,159,160,161,162,163,164,165,166,167],
		2: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
			47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68],
		3: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
		4: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
			47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,
			90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,
			125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,
			158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175],
		5: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38],
		6: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
			47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,
			90,91,92,93,94],
		7: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
			47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,
			90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,
			125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,
			158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,
			191,192,193,194,195,196,197,198,199,200]
	}

	return function($scope, elem) {

		var tabs = '';
		var tabContent = '';
		for(var i in smiles) {
			tabs += '<div tab="' + i +'">' + i +'</div>';
			tabContent += '<div class="block-smile" cat="' + i + '">'
			for(var j in smiles[i]) {
				tabContent += '<img src="smiles/' + i + '/' + smiles[i][j] + '.gif" alt="" tab="' + i + '" num="' + smiles[i][j] + '" />';
			}
			tabContent += '</div>';
		}

		var blocks = '<div class="all-smiles"><div class="tab-smiles">' + tabs +'</div><div class="wrap-smiles">' + tabContent + '</div></div>' +
			'<div>Последние используемые смайлики: <img src="img/show-smiles.png" class="show-smiles" alt="" /></div><div class="fav-smiles"></div>';

		elem.after('<div class="smiles-menu">' + blocks + '</div>');
		var e = $('.smiles-menu');
		var shown = false;
		var expand = true;
		var stack;

		if(localStorage.favSmiles){
			var stk = '';
			stack = JSON.parse(localStorage.favSmiles);
			for(var n = stack.length; n--;){
				stk += '<img src="smiles/' + stack[n].cat + '/' + stack[n].num + '.gif" alt="" tab="' + stack[n].cat + '" num="' + stack[n].num + '" />';
			}
			$('.fav-smiles').html(stk);
		} else {
			stack = [];
		}

		$('.block-smile[cat=' + 1 +']').show();
		$('.tab-smiles > div[tab=' + 1 +']').addClass('tab-smiles-active');

		elem.click(function(){
			if(shown) {
				e.removeClass('show-item');
			} else {
				e.addClass('show-item');
			}
			shown = !shown;
		});
		e.on('click', '.tab-smiles > div', function(){
			var tab = $(this).attr('tab');

			$('.tab-smiles > div').removeClass('tab-smiles-active');
			$(this).addClass('tab-smiles-active');

			$('.block-smile').hide();
			$('.block-smile[cat=' + tab +']').show();

		});
		e.on('click', '.block-smile img', function(){
			var tab = $(this).attr('tab');
			var num = $(this).attr('num');
			var tag = ' *smile' + tab + '.' + num + '* ';
			var stk = '';

			$scope.messageText = $scope.messageText + tag;
			$scope.$apply();
			$('.message-field').focus();

			stack.push({cat:tab, num:num});
			if(stack.length > 6) stack.splice(0, 1);
			for(var n = stack.length; n--;){
				stk += '<img src="smiles/' + stack[n].cat + '/' + stack[n].num + '.gif" alt="" tab="' + stack[n].cat + '" num="' + stack[n].num + '" />';
			}
			$('.fav-smiles').html(stk);

			localStorage.favSmiles = JSON.stringify(stack);

		});
		e.on('click', '.show-smiles', function(){
			if (expand) {
				$('.all-smiles').hide();
				$('.show-smiles').addClass('smiles-arrow-rotate');
			} else {
				$('.all-smiles').show();
				$('.show-smiles').removeClass('smiles-arrow-rotate');
			}
			expand = !expand;
		});
		e.on('click', '.fav-smiles img', function(){
			var tab = $(this).attr('tab');
			var num = $(this).attr('num');
			var tag = ' *smile' + tab + '.' + num + '* ';

			$scope.messageText = $scope.messageText + tag;
			$scope.$apply();
			$('.message-field').focus();
		});


	}
});