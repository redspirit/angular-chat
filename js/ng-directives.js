/**
 * Created with JetBrains PhpStorm.
 * User: Spirit
 * Date: 14.06.14
 * Time: 13:57
 */

app.directive('ngEnter', function() {
	return function($scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13 && $scope.messageText) {
				$scope.enterText($scope.messageText);
				$scope.$apply();
				element.val('');
				$scope.messageText = '';
				event.preventDefault();
			}
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

app.directive('roomContent', function() {
	return function($scope, elem, attrs) {

		elem.find('.roster').perfectScrollbar({'wheelSpeed':10, 'suppressScrollX':true});
		elem.find('.room-messages').perfectScrollbar({'wheelSpeed':10, 'suppressScrollX':true});

	}
});

app.directive('ngRoster', function() {
	return function($scope, elem, attrs) {

		var states = [];
		var statesT = [];

		var privas = [];
		var privasT = [];

		states[0] = 'online.png'; 		statesT[0] = 'Онлайн';
		states[1] = 'away.png'; 		statesT[1] = 'Отошел';
		states[2] = 'busy.png'; 		statesT[2] = 'Занят';
		states[3] = 'stop.png'; 		statesT[3] = 'Отсутствую';
		states[4] = 'work.png'; 		statesT[4] = 'Работаю';
		states[5] = 'rest.png'; 		statesT[5] = 'Отдыхаю';
		states[6] = 'game.png'; 		statesT[6] = 'Играю';
		states[7] = 'music.png';		statesT[7] = 'Слушаю музыку';
		states[8] = 'films.png';		statesT[8] = 'Смотрю фильм';
		states[9] = 'food.png'; 		statesT[9] = 'Кушаю';
		states[10] = 'coffee.png';		statesT[10] = 'Чай / кофе';
		states[11] = 'home.png';		statesT[11] = 'Дела по дому';
		states[12] = 'read.png';		statesT[12] = 'Читаю';
		states[13] = 'sleep.png';		statesT[13] = 'Сплю';
		states[14] = 'pirat.png';		statesT[14] = 'Пират';

		privas[0] = 'empty.png'; 		privasT[0] = '';
		privas[1] = 'admin.png'; 		privasT[1] = 'Админ';
		privas[2] = 'moder.png'; 		privasT[2] = 'Модератор';
		privas[3] = 'owner.png'; 		privasT[3] = 'Хозяин комнаты';
		privas[4] = 'user.png'; 		privasT[4] = 'Пользователь';
		privas[5] = 'novoice.png';		privasT[5] = 'Без голоса';


		$scope.getStateUrl = function(s) {
			return states[parseInt(s)];
		}
		$scope.getStateText = function(s) {
			return statesT[parseInt(s)];
		}


	}
});


app.directive('autoscrollDown', function () {
    return {
        link: function postLink($scope, element) {
            $scope.$watch(
                function () {
                    return element.children().length;
                },
                function () {

                    // todo сделать это!
                    //if(element.prop('offsetHeight') + element.prop('scrollTop') >= element.prop('scrollHeight')) {
                        element.animate({ scrollTop: element.prop('scrollHeight')}, 600);
                    //}

                }
            );
        }
    }
});

app.directive('modalWindow', function () {
    return function($scope, elem) {

        $scope.modalTemplate = 'templates/blank.html';


        $scope.showModal = function(tmp){
            $scope.modalTemplate = 'templates/' + tmp + '.html';

            elem.addClass('md-show');
            $('.overlay').css('visibility','visible');

        }

        $scope.hideModal = function(){
            elem.addClass('md-show');
            $('.overlay').css('visibility','visible');
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