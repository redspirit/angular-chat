<!DOCTYPE html>
<html ng-app="ChatApp">
<head>
	<meta charset="utf-8" />
	<title>Аниме чат NV</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css" rel="stylesheet" media="screen">
	<link rel="stylesheet" type="text/css" href="animate.css">
	<link rel="stylesheet" type="text/css" href="tabs.css?<?= rand(0,9999) ?>" />
	<link rel="stylesheet" type="text/css" href="layout.css?<?= rand(0,9999) ?>" />

	<script src="angular.min.js"></script>
	<script src="app.js"></script>

</head>
<body ng-controller="MainCtrl">

<div class="wrap">
	<div class="header">
		<input class="btn" type="botton" value="добавить" ng-click="addUser(1)" />
	</div>
	<div id="tabs" ng-tabs>

		<ul class="tabs-inset">
			<li ng-repeat="room in rooms" id="tab-{{room.name}}" ng-click="tabClick(room.name)">
				{{room.title}} <span></span>
			</li>
		</ul>

		<div class="tabs-content">
			<div ng-repeat="room in rooms" id="tabcont-{{room.name}}">
				<div ng-repeat="mess in room.messages">
					<b>{{mess.user}}</b>: {{mess.text}}
				</div>
			</div>
		</div>

	</div>
	<div class="ulist">
		<p>Total: {{spisok.length}}</p>


		<div ng-repeat="elem in spisok" class="room">{{elem.dat}}</div>


	</div>
	<div class="input">
		<input type="text" class="message-field" ng-model="messageText" ng-enter="enterText()">
	</div>
	<div class="tools">
		tools
	</div>
</div>	


</body>
</html>