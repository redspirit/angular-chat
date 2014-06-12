var app = angular.module('ChatApp', []);

app.controller('MainCtrl', function($scope, $sce, jq){

	var activeRoom;


	$scope.rooms = {
		room1: {
			title:'Room one',
			messages: [
				{user:'spirit', text:'my first message'},
				{user:'spirit', text:'my second message'}
			]},
		room2: {
			title:'Room two',
			messages:[
				{user:'admin', text:'hello to all'},
				{user:'guest', text:'i am zombie'},
				{user:'guest', text: 'hohoho fofofo'}
			]}
	};


	$scope.tabClick = function(tab){


		jq.$('.tabs-inset > li').removeClass('active-tab');
		jq.$('#tab-'+tab).addClass('active-tab');

		jq.$('.tabs-content > div').hide();
		jq.$('#tabcont-'+tab).show();

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

app.service('jq', function(){
	return {
		$: function(query) {
			var elem = angular.element(document.querySelectorAll(query));
			elem.show = function() {
				elem.css('display', 'block');
			};
			elem.hide = function() {
				elem.css('display', 'none');
			};
			return elem;
		}
	}
});


app.directive('ngEnter', function() {
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