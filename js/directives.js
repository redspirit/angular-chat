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

app.directive('ngTabbutton', function() {
	return function($scope, elem, attrs) {

		elem.find('img').on('click', function() {
			var room = $scope.$eval(attrs.ngTabbutton);
			$scope.closeRoom(room);
		});

	}
});

app.directive('ngToolspanel', function() {
	return function($scope, elem, attrs) {

		$scope.toolsItems = [
			{name: 'one'},
			{name: 'two'},
			{name: 'thr'}
		];

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