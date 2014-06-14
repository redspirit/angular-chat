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

		elem.find('span').on('click', function() {
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
			{name: 'three'}
		];

	}
});

app.directive('ngModal', function() {
	return function($scope, elem, attrs) {



	}
});