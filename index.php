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
			<li ng-repeat="room in rooms" id="tab-{{room.name}}" ng-click="tabClick(room.name)" ng-class="{'active-tab':$first}">
				{{room.caption}} <span></span>
			</li>
		</ul>

		<div class="tabs-content">
			<div ng-repeat="room in rooms" id="tabcont-{{room.name}}">

				<div class="room-messages">
					<div ng-repeat="mess in room.messages">
						<span class="m-date" title="{{dateFormat(mess.d)}}">{{timeFormat(mess.d)}}</span>
						<span class="m-nick">{{mess.n}}</span>
						<span class="m-text" ng-bind-html="messageHtml(mess.t)" ng-class="mess.cls"></span>
					</div>
				</div>

				<div class="roster">
					<table ng-repeat="user in room.users" class="user">
						<tr>
							<td rowspan="2" scope="col" class="cc1">
								<img class="profava" ng-src="{{user.avaurl}}" alt="" />
							</td>
							<td scope="col" style="padding-top:6px">
								<img class="stateSign" src="img/pirat.png" alt="">
								<div class="statetxt">Пират</div>
							</td>
						</tr>
						<tr>
							<td class="cc2">
								<img class="upriv" title="Пользователь" src="img/user.png" alt="">
								<div class="usmenu" priv="4"></div>
							</td>
						</tr>
						<tr>
							<td colspan="2" class="cc3">
								<div class="profnick" title="Юзер: 2770">{{user.nick}}</div>
								<div class="ustatus">{{user.statustext}}</div>
							</td>
						</tr>
					</table>
				</div>

			</div>



		</div>

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