var module = angular.module('ChatApp', []);

module.controller('MainCtrl', function($scope, $sce){

	var activeRoom;

	$scope.some = '';
	$scope.htmlbody = $sce.trustAsHtml('<b>room1</b>');

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


	$scope.tabClick = function(tab){

		$('.tabs-inset > li').removeClass('active-tab');
		$('#tab-'+tab).addClass('active-tab');

		$('.tabs-content > div').hide();
		$('#tabcont-'+tab).show();

		activeRoom = tab;

	}
	$scope.enterText = function(){

		if(!activeRoom) return;

		$scope.rooms[activeRoom].messages.push({
			user: 'Guest',
			text: $scope.messageText
		});

	}

	$scope.messageHtml = function(m){
		return $sce.trustAsHtml(m);
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