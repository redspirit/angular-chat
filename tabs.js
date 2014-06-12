/*
	tabs.js - компонент вкладок (отображения комнат)
	Автор: RedSpirit (17.12.2013)

	*** Конструктор
	Tabs(селектор) - создает компонент вкладок. В селекторе передается контейнер внутри которого будут отображаться вкладки. Возвращает обьект с функциями, описанными ниже.
	
	*** Методы
	addTab(имя, заголовок, контент, подсказка, сделать_активной) - Добавление новой вкладки
	active(имя_вкладки) - сделать активной указанную вкладку
	close(имя_вкладки) - закрыть вкладку и полностью уничтожить ее контент
	recover(callback) - восстанавливает вкладки после закрытия страницы. Вызывается функция callback которая дает имя вкладки и просит вернуть обьект со значениями caption, text, hint для воссоздания вкладок. Метод работает только если еще ни одна вкладка не была создана с помощью addTab
	
	*** Свойства
	activeTab - получить имя текущей вкладки

	*** Собыия
	onSelect(name) - возвращает имя выбранной вкладки
	onClose(name) - возвращает имя закрытой вкладки
	
*/

function Tabs(tabSelector){

	var tb = $(tabSelector);
	tb.append('<ul class="tabs-inset"></ul><div class="tabs-content"></div>');
	var ret = {};
	var tabsStack = [];
	var tabNames = [];	
	var tabNum = 0;
	
	ret.activeTab = '';
	ret.activeTabId = 0;

	ret.addTab = function(name, caption, content, hint, activate){
		tabNum++;
		tabsStack.push(tabNum);
		tabNames.push(name);
		
		var captionEl = $('<li tab="'+tabNum+'" tab-name="'+name+'" title="'+hint+'">'+caption+' <span></span></li>');
		var contentEl = $('<div id="tab-id-'+tabNum+'"></div>');
		contentEl.append(content);
		
		draggable(captionEl);
		//contentEl.perfectScrollbar({'wheelSpeed':100, 'suppressScrollX':true});
		
		tb.find('.tabs-inset').append(captionEl);
		tb.find('.tabs-content').append(contentEl);
		if(activate == true) ret.setActive(tabNum);
		
		localStorage.tabsOrder = JSON.stringify(tabNames);
		
		return tabNum;
	}

	ret.active = function(name){
		var st = tb.find('.tabs-inset li[tab-name='+name+']');	
		if(st.length) ret.setActive(st.attr('tab'));
	}	
	ret.close = function(name){
		var st = tb.find('.tabs-inset li[tab-name='+name+']');	
		if(st.length) ret.closeTab(st.attr('tab'));
	}

	ret.recover = function(callback){
		if(!tb.find('.tabs-inset li').length){
			var order = JSON.parse(localStorage.tabsOrder);
			for(var i in order){
				var cont = callback(order[i]);
				ret.addTab(order[i], cont.caption, cont.text, cont.hint);
			}
			ret.active(localStorage.tabsActive);
		}	
	}
	
	ret.setActive = function(num){
		ret.activeTabId = parseInt(num);
		tb.find('.tabs-content > div').hide();
		tb.find('.tabs-inset li').removeClass('active-tab');
		var st = tb.find('.tabs-inset li[tab='+num+']');
		st.addClass('active-tab');
		ret.activeTab = st.attr('tab-name');
		tb.find('.tabs-content #tab-id-'+num).show();
		if(typeof(ret.onSelect)=='function') ret.onSelect(ret.activeTab);
		localStorage.tabsActive = ret.activeTab;
	}
	
	ret.closeTab = function(num){
		num = parseInt(num);
		if(tabsStack.length == 1) return false;
		var st = tb.find('.tabs-inset li[tab='+num+']');
		var closedTab = st.attr('tab-name');
		st.remove();
		tb.find('.tabs-content #tab-id-'+num).remove();
		var dId = tabsStack.indexOf(num);
		var aId = (dId == 0) ? 0 : dId - 1;
		tabsStack.splice(dId, 1);
		if(typeof(ret.onClose)=='function') ret.onClose(closedTab);
		if(ret.activeTabId == num) ret.setActive(tabsStack[aId]);
	}
	
	tb.on('mousedown', '.tabs-inset li', function(){
		var tabId = parseInt($(this).attr('tab'));
		if(tabId != ret.activeTabId) ret.setActive(tabId);
	});
	tb.on('mousedown', '.tabs-inset li span', function(event){
		event.stopPropagation();
		var tabId = $(this).parent('li').attr('tab');
		ret.closeTab(tabId);
	});	
	
	function draggable(drag){
		function disableSelection(){
			return false;
		}
		$(drag).mousedown(function(e){
			var dragWidth = drag.outerWidth(true);
			var posParentLeft = drag.parent().offset().left;
			var posParentRight = posParentLeft + drag.parent().width();
			var posOld = drag.offset().left;
			var posOldCorrection = e.pageX - posOld;
			var isLast = (drag.next().length == 0);
			drag.css({'z-index':2}).addClass('dragged-element');
			var mouseMove = function(e){
				var posNew = e.pageX - posOldCorrection;
				var posLeft = parseInt(drag.css('left'));
				if (posNew < posParentLeft){
					drag.offset({'left': posParentLeft});
					if (drag.prev().length > 0 ) {
						drag.insertBefore(drag.prev().css({'left':-dragWidth}).animate({'left':0}, 100));
					}
				} else if ((posNew + dragWidth) > posParentRight){
					drag.offset({'left': posParentRight - dragWidth});
					if (drag.next().length > 0 ) {
						drag.insertAfter(drag.next().css({'left':dragWidth}).animate({'left':0}, 100));
					}
				} else {
					drag.offset({'left': posNew});
					
					if (posLeft <= -dragWidth / 2){ // двигаем влево
						drag.insertBefore(drag.prev().css({'left':-dragWidth}).animate({'left':0}, 100));
						drag.css({'left': dragWidth/2 });
						posOld = drag.offset().left;
						posNew = e.pageX - posOldCorrection;
						posOldCorrection = e.pageX - posOld;
					} else if (posLeft >= dragWidth / 2 && !isLast){	// двигаем вправо
						drag.insertAfter(drag.next().css({'left':dragWidth}).animate({'left':0}, 100));
						drag.css({'left': -dragWidth / 2 });
						posOld = drag.offset().left;
						posNew = e.pageX - posOldCorrection;
						posOldCorrection = e.pageX - posOld;
						isLast = (drag.next().length == 0);
					}
				}
			};
			var mouseUp = function(){
				$(document).off('mousemove', mouseMove).off('mouseup', mouseUp);
				$(document).off('mousedown', disableSelection);
				drag.animate({'left':0}, 100, function(){
					drag.css({'z-index':1}).removeClass('dragged-element');
				});

				tabsStack = [];
				tabNames = [];
				tb.find('.tabs-inset li').each(function(){
					var tabVal = $(this).attr('tab');
					var tabName = $(this).attr('tab-name');
					tabsStack.push(parseInt(tabVal));
					tabNames.push(tabName);
				});

				localStorage.tabsOrder = JSON.stringify(tabNames);
				
			};
			$(document).on('mousemove', mouseMove).on('mouseup', mouseUp).on('contextmenu', mouseUp);
			$(document).on('mousedown', disableSelection);
			$(window).on('blur', mouseUp);
		});
	};
	
	return ret;
}