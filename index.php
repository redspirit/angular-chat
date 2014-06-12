<!DOCTYPE html>
<html ng-app="ChatApp">
<head>
	<meta charset="utf-8" />
	<title>Angular chat</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css" rel="stylesheet" media="screen">
	<link rel="stylesheet" type="text/css" href="animate.css">
	<link rel="stylesheet" type="text/css" href="tabs.css" />
	<link rel="stylesheet" type="text/css" href="layout.css" />

	<script src="microevent.js"></script>

	<script src="angular.min.js"></script>
	<script src="app.js"></script>
	<script src="net.js"></script>

</head>
<body ng-controller="MainCtrl">
<div class="wrap">
	<div class="header">


	</div>
	<div id="tabs">

		<ul class="tabs-inset">
			<li ng-repeat="(name, room) in rooms" id="tab-{{name}}" ng-click="tabClick(name)" ng-class="{'active-tab':$first}">
				{{room.title}} <span></span>
			</li>
		</ul>

		<div class="tabs-content">
			<div ng-repeat="(name, room) in rooms" id="tabcont-{{name}}">
				<div ng-repeat="mess in room.messages">
					<b>{{mess.user}}</b>: <span ng-bind-html="messageHtml(mess.text)"></span>
				</div>
			</div>
		</div>

	</div>
	<div class="ulist">


	</div>
	<div class="input">
		<input type="text" class="message-field" ng-model="messageText" ng-enter>
	</div>
	<div class="tools">
		tools
	</div>
</div>	


</body>
</html>