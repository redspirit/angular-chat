<!DOCTYPE html>
<html ng-app="ChatApp">
<head>
	<meta charset="utf-8" />
	<title>Hitagi Chat 3</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
	<link rel="icon" href="favicon.ico" type="image/x-icon">

	<link rel="stylesheet" href="css/bootstrap.min.css" media="screen">
	<link rel="stylesheet" href="css/jquery.fancybox.css" type="text/css" >
	<link rel="stylesheet" href="css/style.css" type="text/css" />
	<link rel="stylesheet" href="css/modals.css" type="text/css" />
	<link rel="stylesheet" href="css/scrollbars.css" type="text/css" />

	<script src="js/jquery-2.1.1.min.js"></script>
	<script src="js/microevent.js"></script>
	<script src="js/perfect-scrollbar.min.js"></script>
	<script src="js/jquery.fancybox.pack.js"></script>

	<script src="js/angular.min.js"></script>
	<script src="locales/locale_ru.js"></script>
	<script src="js/app.js"></script>
	<script src="js/ng-services.js"></script>
	<script src="js/ng-directives.js"></script>
	<script src="js/ng-net.js"></script>

</head>
<body ng-controller="MainCtrl">
<div class="wrap">
	<div class="header">

		<a href="#">
			<img src="img/logo.png" class="logo" alt="main page" />
		</a>

		<div class="extra-links">
			<a href="http://vk.com/hitagi_chat" target="_blank" class="link-vk" title="Наша группа в ВК"></a>
		</div>

		<div class="my-info">
			<div class="mess-count" ng-show="me.messcount"><ng-pluralize count="me.messcount" when="messagesForms"></ng-pluralize></div>
			<span class="my-nick" ng-click="showModal('edit_profile')" title="Редакрировать мой профиль">{{me.nick}}</span>
			<img class="ava" ng-click="showModal('set_avatar')" ng-src="{{me.avaurl}}" title="Сменить аватарку" alt="" />
		</div>


		<input type="button" value="PM" ng-click="testAction()" />

	</div>
	<div id="tabs">

		<ul class="tabs-inset">
			<li ng-repeat="room in rooms | toArray | orderBy:'index'"
				id="tab-{{room.name}}"
				tab-button="room.name"
				ng-click="tabClick(room.name)"
				ng-class="{'active-tab':$first}">
				<span>{{room.caption}}</span>
				<p ng-show="room.unread" >{{room.unread}}</p>
				<img class="tab-close" src="img/tab-close.png" alt="" />
			</li>
			<li class="new-room">
				<img src="img/plus.png" alt="" title="Открыть новую комнату" ng-click="addroom()"/>
 			</li>
		</ul>

		<div class="tabs-content">
			<div ng-repeat="room in rooms" id="tabcont-{{room.name}}" room-content>

				<div class="room-messages" autoscroll-down>
					<div ng-repeat="mess in room.messages">
						<span class="m-date" mtitle="{{mess.d*1000 | date:'d MMMM, hh:mm:ss'}}">{{mess.d*1000 | date:'hh:mm'}}</span>
						<span class="m-nick">{{mess.n}}</span>
						<span class="m-text" ng-bind-html="messageHtml(mess.t)" ng-class="mess.cls"></span>
					</div>
				</div>

				<div class="room-info">
					Людей в комнате: <b>{{tools.countObj(room.users)}}</b>
				</div>

				<div class="roster" roster>
					<table ng-repeat="user in room.users | toArray | orderBy:'nick'" class="user">
						<tr>
							<td rowspan="2" scope="col" class="cc1">
								<img class="profava" ng-src="{{user.avaurl}}" ng-click="clickOnUserAva(user.login)" user="{{user.login}}" alt="" />
							</td>
							<td scope="col" style="padding-top:6px">
								<img class="stateSign" ng-src="{{tools.getStateUrl(user.state)}}" alt="">
								<div class="statetxt">{{tools.getStateText(user.state)}}</div>
							</td>
						</tr>
						<tr>
							<td class="cc2">
								<img class="upriv" title="Пользователь" src="img/user.png" alt="">
							</td>
						</tr>
						<tr>
							<td colspan="2" class="cc3">
								<div class="profnick">{{user.nick}}</div>
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
	<div class="tools" tool-spanel>
		<div ng-repeat="btn in toolsItems">
			{{btn.name}}
		</div>
	</div>
</div>



<div class="overlay" ng-click="hideModal()"></div>
<div class="md-modal md-effect-1" modal-window>
	<div class="md-content" ng-include="modalTemplate" onload="modalLoad()"></div>
</div>

<div class="pos-modal pos-effect" pos-modal>
	<div class="pos-content">
		<h3>{{posmodal.title}}</h3>
		<div ng-bind-html="messageHtml(posmodal.content)"></div>
		<p>
			<a href="#" ng-click="posModalHide()">close it</a>
		</p>
	</div>
</div>

<div class="dtooltip"></div>

</body>
</html>