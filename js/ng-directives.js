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

app.directive('toolsPanel', function() {
	return function($scope, elem, attrs) {

		$scope.toolsItems = [
			{name: 'one'},
			{name: 'two'},
			{name: 'thr'}
		];

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
					}, 1000);

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

app.directive('smileBlock', function() {

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

	return function($scope, elem, attrs) {



	}
});