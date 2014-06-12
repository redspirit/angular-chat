var module = angular.module('ChatApp', []);

module.controller('MainCtrl', function($scope){

	var activeRoom;

	$scope.rooms = {
		room1: {
			name: 'room1',
			title:'Room one',
			messages: [
				{user:'spirit', text:'my first message'},
				{user:'spirit', text:'my second message'}
			]},
		room2: {
			name: 'room2',
			title:'Room two',
			messages:[
				{user:'admin', text:'hello to all'},
				{user:'guest', text:'i am zombie'},
				{user:'guest', text: 'hohoho fofofo'}
			]}
	};



	$scope.addUser = function(a){

		//$scope.spisok.push({dat: '<div class="message">empty room</div>'});

	}
	$scope.tabClick = function(tab){

		$('.tabs-inset > li').removeClass('active-tab');
		$('#tab-'+tab).addClass('active-tab');

		$('.tabs-content > div').hide();
		$('#tabcont-'+tab).show();

		activeRoom = tab;

	}
	$scope.enterText = function(){

		$scope.rooms[activeRoom].messages.push({
			user: 'Guest',
			text: $scope.messageText
		});

	}

});


module.directive('ngEnter', function() {
	return function($scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13 && $scope.messageText) {
				$scope.$apply(function(){
					$scope.$eval(attrs.ngEnter);
				});
				element.val('');
				$scope.messageText = '';
				event.preventDefault();
			}
		});
	}
});