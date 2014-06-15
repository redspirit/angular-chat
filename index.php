<!DOCTYPE html>
<html ng-app="ChatApp">
<head>
	<meta charset="utf-8" />
	<title>Angular chat</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css" rel="stylesheet" media="screen">
	<link rel="stylesheet" type="text/css" href="css/animate.css">
	<link rel="stylesheet" type="text/css" href="css/style.css" />

	<script src="js/microevent.js"></script>

	<script src="js/angular.min.js"></script>
	<script src="js/app.js"></script>
	<script src="js/directives.js"></script>
	<script src="js/services.js"></script>
	<script src="js/net.js"></script>

</head>
<body ng-controller="MainCtrl">
<div class="wrap">
	<div class="header">
		<div class="extra-links">
			<a href="http://vk.com/hitagi_chat" target="_blank" class="link-vk" title="Наша группа в ВК"></a>
		</div>



		<!--<input type="button" value="PM" ng-click="personalmessage('admin')" />-->

	</div>
	<div id="tabs">

		<ul class="tabs-inset">
			<li ng-repeat="room in rooms | toArray | orderBy:'index'"
				id="tab-{{room.name}}"
				ng-tabbutton="room.name"
				ng-click="tabClick(room.name)"
				ng-class="{'active-tab':$first}">
				<span>{{room.caption}}</span>
				<img class="tab-close" src="img/tab-close.png" alt="" />
			</li>
			<li class="new-room">
				<img src="img/plus.png" alt="" title="Открыть новую комнату" ng-click="addroom()"/>
 			</li>
		</ul>

		<div class="tabs-content">
			<div ng-repeat="room in rooms" id="tabcont-{{room.name}}">

				<div class="room-messages">
					<div ng-repeat="mess in room.messages">
						<span class="m-date" title="{{mess.d*1000 | date:'MMMM d, y hh:mm:ss'}}">{{mess.d*1000 | date:'hh:mm'}}</span>
						<span class="m-nick">{{mess.n}}</span>
						<span class="m-text" ng-bind-html="messageHtml(mess.t)" ng-class="mess.cls"></span>
					</div>
				</div>

				<div class="roster" ng-roster>
					<table ng-repeat="user in room.users | toArray | orderBy:'nick'" class="user">
						<tr>
							<td rowspan="2" scope="col" class="cc1">
								<img class="profava" ng-src="{{user.avaurl}}" alt="" />
							</td>
							<td scope="col" style="padding-top:6px">
								<img class="stateSign" ng-src="{{'img/states/'+getStateUrl(user.state)}}" alt="">
								<div class="statetxt">{{getStateText(user.state)}}</div>
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
								<div class="profnick" title="{{user.login}}">{{user.nick}}</div>
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
	<div class="tools" ng-toolspanel>
		<div ng-repeat="btn in toolsItems">
			{{btn.name}}
		</div>
	</div>
</div>

<div id="overlay" ng-show="modal.visible" ng-click="modalClose()"></div>
<div class="modal-form" ng-show="modal.visible">
	<div class="close-form" ng-click="modalClose()"><img title="Закрыть" src="img/close-form.png" alt=""></div>
	<h1>{{modal.title}}</h1>
	<div ng-bind-html="modal.content"></div>
</div>

</body>
</html>