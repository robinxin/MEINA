/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

if(!dojo._hasResource["dijit.MenuItem"]){dojo._hasResource["dijit.MenuItem"]=true;dojo.provide("dijit.MenuItem");dojo.declare("dijit.MenuItem",[dijit._Widget,dijit._Templated,dijit._Contained,dijit._CssStateMixin],{templateString:dojo.cache("dijit","templates/MenuItem.html","<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\"\r\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\r\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\r\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\r\n\t</td>\r\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\r\n\t\t<div dojoAttachPoint=\"arrowWrapper\" style=\"visibility: hidden\">\r\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\r\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\r\n\t\t</div>\r\n\t</td>\r\n</tr>\r\n"),attributeMap:dojo.delegate(dijit._Widget.prototype.attributeMap,{label:{node:"containerNode",type:"innerHTML"},iconClass:{node:"iconNode",type:"class"}}),baseClass:"dijitMenuItem",label:"",iconClass:"",accelKey:"",disabled:false,_fillContent:function(_1){if(_1&&!("label" in this.params)){this.set("label",_1.innerHTML);}},buildRendering:function(){this.inherited(arguments);var _2=this.id+"_text";dojo.attr(this.containerNode,"id",_2);if(this.accelKeyNode){dojo.attr(this.accelKeyNode,"id",this.id+"_accel");_2+=" "+this.id+"_accel";}dijit.setWaiState(this.domNode,"labelledby",_2);dojo.setSelectable(this.domNode,false);},_onHover:function(){this.getParent().onItemHover(this);},_onUnhover:function(){this.getParent().onItemUnhover(this);this._set("hovering",false);},_onClick:function(_3){this.getParent().onItemClick(this,_3);dojo.stopEvent(_3);},onClick:function(_4){},focus:function(){try{if(dojo.isIE==8){this.containerNode.focus();}dijit.focus(this.focusNode);}catch(e){}},_onFocus:function(){this._setSelected(true);this.getParent()._onItemFocus(this);this.inherited(arguments);},_setSelected:function(_5){dojo.toggleClass(this.domNode,"dijitMenuItemSelected",_5);},setLabel:function(_6){dojo.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");this.set("label",_6);},setDisabled:function(_7){dojo.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.","","2.0");this.set("disabled",_7);},_setDisabledAttr:function(_8){dijit.setWaiState(this.focusNode,"disabled",_8?"true":"false");this._set("disabled",_8);},_setAccelKeyAttr:function(_9){this.accelKeyNode.style.display=_9?"":"none";this.accelKeyNode.innerHTML=_9;dojo.attr(this.containerNode,"colSpan",_9?"1":"2");this._set("accelKey",_9);}});}if(!dojo._hasResource["dijit.PopupMenuItem"]){dojo._hasResource["dijit.PopupMenuItem"]=true;dojo.provide("dijit.PopupMenuItem");dojo.declare("dijit.PopupMenuItem",dijit.MenuItem,{_fillContent:function(){if(this.srcNodeRef){var _a=dojo.query("*",this.srcNodeRef);dijit.PopupMenuItem.superclass._fillContent.call(this,_a[0]);this.dropDownContainer=this.srcNodeRef;}},startup:function(){if(this._started){return;}this.inherited(arguments);if(!this.popup){var _b=dojo.query("[widgetId]",this.dropDownContainer)[0];this.popup=dijit.byNode(_b);}dojo.body().appendChild(this.popup.domNode);this.popup.startup();this.popup.domNode.style.display="none";if(this.arrowWrapper){dojo.style(this.arrowWrapper,"visibility","");}dijit.setWaiState(this.focusNode,"haspopup","true");},destroyDescendants:function(){if(this.popup){if(!this.popup._destroyed){this.popup.destroyRecursive();}delete this.popup;}this.inherited(arguments);}});}if(!dojo._hasResource["dijit.CheckedMenuItem"]){dojo._hasResource["dijit.CheckedMenuItem"]=true;dojo.provide("dijit.CheckedMenuItem");dojo.declare("dijit.CheckedMenuItem",dijit.MenuItem,{templateString:dojo.cache("dijit","templates/CheckedMenuItem.html","<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\"\r\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\r\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\r\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\r\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\r\n\t</td>\r\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode,labelNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&nbsp;</td>\r\n</tr>\r\n"),checked:false,_setCheckedAttr:function(_c){dojo.toggleClass(this.domNode,"dijitCheckedMenuItemChecked",_c);dijit.setWaiState(this.domNode,"checked",_c);this._set("checked",_c);},onChange:function(_d){},_onClick:function(e){if(!this.disabled){this.set("checked",!this.checked);this.onChange(this.checked);}this.inherited(arguments);}});}if(!dojo._hasResource["dijit.MenuSeparator"]){dojo._hasResource["dijit.MenuSeparator"]=true;dojo.provide("dijit.MenuSeparator");dojo.declare("dijit.MenuSeparator",[dijit._Widget,dijit._Templated,dijit._Contained],{templateString:dojo.cache("dijit","templates/MenuSeparator.html","<tr class=\"dijitMenuSeparator\">\r\n\t<td class=\"dijitMenuSeparatorIconCell\">\r\n\t\t<div class=\"dijitMenuSeparatorTop\"></div>\r\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\r\n\t</td>\r\n\t<td colspan=\"3\" class=\"dijitMenuSeparatorLabelCell\">\r\n\t\t<div class=\"dijitMenuSeparatorTop dijitMenuSeparatorLabel\"></div>\r\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\r\n\t</td>\r\n</tr>\r\n"),buildRendering:function(){this.inherited(arguments);dojo.setSelectable(this.domNode,false);},isFocusable:function(){return false;}});}if(!dojo._hasResource["dijit.Menu"]){dojo._hasResource["dijit.Menu"]=true;dojo.provide("dijit.Menu");dojo.declare("dijit._MenuBase",[dijit._Widget,dijit._Templated,dijit._KeyNavContainer],{parentMenu:null,popupDelay:500,startup:function(){if(this._started){return;}dojo.forEach(this.getChildren(),function(_e){_e.startup();});this.startupKeyNavChildren();this.inherited(arguments);},onExecute:function(){},onCancel:function(_f){},_moveToPopup:function(evt){if(this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled){this.focusedChild._onClick(evt);}else{var _10=this._getTopMenu();if(_10&&_10._isMenuBar){_10.focusNext();}}},_onPopupHover:function(evt){if(this.currentPopup&&this.currentPopup._pendingClose_timer){var _11=this.currentPopup.parentMenu;if(_11.focusedChild){_11.focusedChild._setSelected(false);}_11.focusedChild=this.currentPopup.from_item;_11.focusedChild._setSelected(true);this._stopPendingCloseTimer(this.currentPopup);}},onItemHover:function(_12){if(this.isActive){this.focusChild(_12);if(this.focusedChild.popup&&!this.focusedChild.disabled&&!this.hover_timer){this.hover_timer=setTimeout(dojo.hitch(this,"_openPopup"),this.popupDelay);}}if(this.focusedChild){this.focusChild(_12);}this._hoveredChild=_12;},_onChildBlur:function(_13){this._stopPopupTimer();_13._setSelected(false);var _14=_13.popup;if(_14){this._stopPendingCloseTimer(_14);_14._pendingClose_timer=setTimeout(function(){_14._pendingClose_timer=null;if(_14.parentMenu){_14.parentMenu.currentPopup=null;}dijit.popup.close(_14);},this.popupDelay);}},onItemUnhover:function(_15){if(this.isActive){this._stopPopupTimer();}if(this._hoveredChild==_15){this._hoveredChild=null;}},_stopPopupTimer:function(){if(this.hover_timer){clearTimeout(this.hover_timer);this.hover_timer=null;}},_stopPendingCloseTimer:function(_16){if(_16._pendingClose_timer){clearTimeout(_16._pendingClose_timer);_16._pendingClose_timer=null;}},_stopFocusTimer:function(){if(this._focus_timer){clearTimeout(this._focus_timer);this._focus_timer=null;}},_getTopMenu:function(){for(var top=this;top.parentMenu;top=top.parentMenu){}return top;},onItemClick:function(_17,evt){if(typeof this.isShowingNow=="undefined"){this._markActive();}this.focusChild(_17);if(_17.disabled){return false;}if(_17.popup){this._openPopup();}else{this.onExecute();_17.onClick(evt);}},_openPopup:function(){this._stopPopupTimer();var _18=this.focusedChild;if(!_18){return;}var _19=_18.popup;if(_19.isShowingNow){return;}if(this.currentPopup){this._stopPendingCloseTimer(this.currentPopup);dijit.popup.close(this.currentPopup);}_19.parentMenu=this;_19.from_item=_18;var _1a=this;dijit.popup.open({parent:this,popup:_19,around:_18.domNode,orient:this._orient||(this.isLeftToRight()?{"TR":"TL","TL":"TR","BR":"BL","BL":"BR"}:{"TL":"TR","TR":"TL","BL":"BR","BR":"BL"}),onCancel:function(){_1a.focusChild(_18);_1a._cleanUp();_18._setSelected(true);_1a.focusedChild=_18;},onExecute:dojo.hitch(this,"_cleanUp")});this.currentPopup=_19;_19.connect(_19.domNode,"onmouseenter",dojo.hitch(_1a,"_onPopupHover"));if(_19.focus){_19._focus_timer=setTimeout(dojo.hitch(_19,function(){this._focus_timer=null;this.focus();}),0);}},_markActive:function(){this.isActive=true;dojo.replaceClass(this.domNode,"dijitMenuActive","dijitMenuPassive");},onOpen:function(e){this.isShowingNow=true;this._markActive();},_markInactive:function(){this.isActive=false;dojo.replaceClass(this.domNode,"dijitMenuPassive","dijitMenuActive");},onClose:function(){this._stopFocusTimer();this._markInactive();this.isShowingNow=false;this.parentMenu=null;},_closeChild:function(){this._stopPopupTimer();var _1b=this.focusedChild&&this.focusedChild.from_item;if(this.currentPopup){if(dijit._curFocus&&dojo.isDescendant(dijit._curFocus,this.currentPopup.domNode)){this.focusedChild.focusNode.focus();}dijit.popup.close(this.currentPopup);this.currentPopup=null;}if(this.focusedChild){this.focusedChild._setSelected(false);this.focusedChild._onUnhover();this.focusedChild=null;}},_onItemFocus:function(_1c){if(this._hoveredChild&&this._hoveredChild!=_1c){this._hoveredChild._onUnhover();}},_onBlur:function(){this._cleanUp();this.inherited(arguments);},_cleanUp:function(){this._closeChild();if(typeof this.isShowingNow=="undefined"){this._markInactive();}}});dojo.declare("dijit.Menu",dijit._MenuBase,{constructor:function(){this._bindings=[];},templateString:dojo.cache("dijit","templates/Menu.html","<table class=\"dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable\" role=\"menu\" tabIndex=\"${tabIndex}\" dojoAttachEvent=\"onkeypress:_onKeyPress\" cellspacing=\"0\">\r\n\t<tbody class=\"dijitReset\" dojoAttachPoint=\"containerNode\"></tbody>\r\n</table>\r\n"),baseClass:"dijitMenu",targetNodeIds:[],contextMenuForWindow:false,leftClickToOpen:false,refocus:true,postCreate:function(){if(this.contextMenuForWindow){this.bindDomNode(dojo.body());}else{dojo.forEach(this.targetNodeIds,this.bindDomNode,this);}var k=dojo.keys,l=this.isLeftToRight();this._openSubMenuKey=l?k.RIGHT_ARROW:k.LEFT_ARROW;this._closeSubMenuKey=l?k.LEFT_ARROW:k.RIGHT_ARROW;this.connectKeyNavHandlers([k.UP_ARROW],[k.DOWN_ARROW]);},_onKeyPress:function(evt){if(evt.ctrlKey||evt.altKey){return;}switch(evt.charOrCode){case this._openSubMenuKey:this._moveToPopup(evt);dojo.stopEvent(evt);break;case this._closeSubMenuKey:if(this.parentMenu){if(this.parentMenu._isMenuBar){this.parentMenu.focusPrev();}else{this.onCancel(false);}}else{dojo.stopEvent(evt);}break;}},_iframeContentWindow:function(_1d){var win=dojo.window.get(this._iframeContentDocument(_1d))||this._iframeContentDocument(_1d)["__parent__"]||(_1d.name&&dojo.doc.frames[_1d.name])||null;return win;},_iframeContentDocument:function(_1e){var doc=_1e.contentDocument||(_1e.contentWindow&&_1e.contentWindow.document)||(_1e.name&&dojo.doc.frames[_1e.name]&&dojo.doc.frames[_1e.name].document)||null;return doc;},bindDomNode:function(_1f){_1f=dojo.byId(_1f);var cn;if(_1f.tagName.toLowerCase()=="iframe"){var _20=_1f,win=this._iframeContentWindow(_20);cn=dojo.withGlobal(win,dojo.body);}else{cn=(_1f==dojo.body()?dojo.doc.documentElement:_1f);}var _21={node:_1f,iframe:_20};dojo.attr(_1f,"_dijitMenu"+this.id,this._bindings.push(_21));var _22=dojo.hitch(this,function(cn){return [dojo.connect(cn,this.leftClickToOpen?"onclick":"oncontextmenu",this,function(evt){dojo.stopEvent(evt);this._scheduleOpen(evt.target,_20,{x:evt.pageX,y:evt.pageY});}),dojo.connect(cn,"onkeydown",this,function(evt){if(evt.shiftKey&&evt.keyCode==dojo.keys.F10){dojo.stopEvent(evt);this._scheduleOpen(evt.target,_20);}})];});_21.connects=cn?_22(cn):[];if(_20){_21.onloadHandler=dojo.hitch(this,function(){var win=this._iframeContentWindow(_20);cn=dojo.withGlobal(win,dojo.body);_21.connects=_22(cn);});if(_20.addEventListener){_20.addEventListener("load",_21.onloadHandler,false);}else{_20.attachEvent("onload",_21.onloadHandler);}}},unBindDomNode:function(_23){var _24;try{_24=dojo.byId(_23);}catch(e){return;}var _25="_dijitMenu"+this.id;if(_24&&dojo.hasAttr(_24,_25)){var bid=dojo.attr(_24,_25)-1,b=this._bindings[bid];dojo.forEach(b.connects,dojo.disconnect);var _26=b.iframe;if(_26){if(_26.removeEventListener){_26.removeEventListener("load",b.onloadHandler,false);}else{_26.detachEvent("onload",b.onloadHandler);}}dojo.removeAttr(_24,_25);delete this._bindings[bid];}},_scheduleOpen:function(_27,_28,_29){if(!this._openTimer){this._openTimer=setTimeout(dojo.hitch(this,function(){delete this._openTimer;this._openMyself({target:_27,iframe:_28,coords:_29});}),1);}},_openMyself:function(_2a){var _2b=_2a.target,_2c=_2a.iframe,_2d=_2a.coords;if(_2d){if(_2c){var od=_2b.ownerDocument,ifc=dojo.position(_2c,true),win=this._iframeContentWindow(_2c),_2e=dojo.withGlobal(win,"_docScroll",dojo);var cs=dojo.getComputedStyle(_2c),tp=dojo._toPixelValue,_2f=(dojo.isIE&&dojo.isQuirks?0:tp(_2c,cs.paddingLeft))+(dojo.isIE&&dojo.isQuirks?tp(_2c,cs.borderLeftWidth):0),top=(dojo.isIE&&dojo.isQuirks?0:tp(_2c,cs.paddingTop))+(dojo.isIE&&dojo.isQuirks?tp(_2c,cs.borderTopWidth):0);_2d.x+=ifc.x+_2f-_2e.x;_2d.y+=ifc.y+top-_2e.y;}}else{_2d=dojo.position(_2b,true);_2d.x+=10;_2d.y+=10;}var _30=this;var _31=dijit.getFocus(this);function _32(){if(_30.refocus){dijit.focus(_31);}dijit.popup.close(_30);};dijit.popup.open({popup:this,x:_2d.x,y:_2d.y,onExecute:_32,onCancel:_32,orient:this.isLeftToRight()?"L":"R"});this.focus();this._onBlur=function(){this.inherited("_onBlur",arguments);dijit.popup.close(this);};},uninitialize:function(){dojo.forEach(this._bindings,function(b){if(b){this.unBindDomNode(b.node);}},this);this.inherited(arguments);}});}if(!dojo._hasResource["window.widget.Toolbar"]){dojo._hasResource["window.widget.Toolbar"]=true;dojo.provide("window.widget.Toolbar");dojo.declare("window.widget.Toolbar",[dijit._Widget,dijit._Templated],{templateString:"<div><span dojoAttachPoint='toolbarContainer'></span></div>",drawboard:null,postCreate:function(){var _33=new dijit.Toolbar({},this.toolbarContainer),_34=this.getDefinition()._arrayOfAllItems[0].children,_35=drawboard.Constant.Toolbar,_36,_37,_38=this,_39,_3a;dojo.forEach(_34,function(_3b){_37=_3b.name[0];_3a=dojo.hitch(_38,_3b.action[0]);switch(_3b.type&&_3b.type[0]){case _35.COLORPALETTE:_36=new dijit.form.DropDownButton({label:_37,title:_37,showLabel:true,dropDown:new dijit.ColorPalette({drawboard:_38.drawboard,palette:"7x10",onChange:_3a})});break;case _35.DROPDOWNLIST:_39=_3b.list;if(!(_39 instanceof Array)){var _3c=_39.start,end=_39.end,_39=[];while(_3c<=end){_39.push(_3c);_3c++;}}_36=_38.createDropDownList(_39,_38[_3b.action[0]],_37,_38.drawboard);break;default:_36=new dijit.form.Button({label:_37,showLabel:false,title:_37,iconClass:"dijitEditorIcon dijitEditorIcon toolbarIcon "+_3b.css[0],onClick:_3a});break;}_36&&_33.addChild(_36);_36=null;});},strokeWidth:function(e){this.drawboard.setStyle("stroke-width",this.label);},stroke:function(e){this.drawboard.setStyle("stroke",e);},fill:function(e){this.drawboard.setStyle("fill",e);},combine:function(e){this.drawboard.combine();},divide:function(e){this.drawboard.divide();},next:function(e){this.drawboard.redo();},previous:function(e){this.drawboard.undo();},save:function(e){},createDropDownList:function(_3d,_3e,_3f,_40){var _41=new dijit.Menu({style:"display: none;"});dojo.forEach(_3d,function(_42){var _43=new dijit.MenuItem({label:_42,name:_42,onClick:_3e,drawboard:_40});_41.addChild(_43);},this);return new dijit.form.DropDownButton({label:_3f,dropDown:_41});},createDefinition:function(){this.definition=new dojo.data.ItemFileReadStore({url:drawboardRuntimeSetting.toolbarImgUrl});this.definition._forceLoad();},getDefinition:function(){if(!this.definition){this.createDefinition();}return this.definition;}});}if(!dojo._hasResource["window.widget.GraphChooseContainer"]){dojo._hasResource["window.widget.GraphChooseContainer"]=true;dojo.provide("window.widget.GraphChooseContainer");dojo.declare("window.widget.GraphChooseContainer",[dijit._Widget,dijit._Templated],{templateString:"<div></div>",definition:null,accordion:null,width:null,height:null,active:null,drawboard:null,overNode:null,clickCss:"graphClick",overCss:"graphOver",events:null,postCreate:function(){var _44=[],_45=this;(this.width)&&(_44.push("width:"+this.width+";"));(this.height)&&(_44.push("height:"+this.height+";"));var _46=new dijit.layout.AccordionContainer({style:_44.join(" ")}).placeAt(this.domNode);dojo.connect(_46,"_showChild",function(){_45.clearStatus();});_46.startup();this.accordion=_46;this.createContent();dojo.subscribe("/drawboard/mouseup",dojo.hitch(this,"clearStatus"));this.events=[dojo.connect(this.domNode,"onclick",this,this.doclick),dojo.connect(this.domNode,"onmousemove",this,this.domousemove)];},clearStatus:function(){this.drawboard.setDrawType(null);var _47=this.active;if(_47){dojo.removeClass(_47,this.clickCss);this.active=null;}},getDefinition:function(){if(!this.definition){this.createDefinition();}return this.definition;},createDefinition:function(){this.definition=new dojo.data.ItemFileReadStore({url:drawboardRuntimeSetting.graphImgUrl});this.definition._forceLoad();},createContent:function(){var _48=this.getDefinition(),_49=_48._arrayOfAllItems[0],_4a=this.createGraphContent;dojo.forEach(_49.children,function(_4b,_4c){_4a.call(this,_4b,_4c);},this);},createGraphContent:function(_4d,_4e){var _4f=new dijit.layout.ContentPane({title:_4d.name[0]});_4f.containerNode.innerHTML=this.generateGraphContent(_4d);this.accordion.addChild(_4f);},generateGraphContent:function(_50){var _51=[],_52;dojo.forEach(_50.children,function(_53){_52=["<div id=",_53.id[0]," name=",_53.name[0]," title=",_53.name[0],"",""," strategy='",_53.strategy[0],"' class='graphIconContainer'><img src='",drawboardRuntimeSetting.blankGif,"' class='graphIcon ",(_50.css||"")," ",_53.css[0],"'/>","<span class='graphText'>",_53.name[0],"</span></div>"];if(_53.url){_52[6]=" url='"+_53.url[0]+"'";}if(_53.ratio){_52[7]=" ratio='"+_53.ratio[0]+"'";}_51.push(_52.join(" "));},this);return _51.join(" ");},getGraphNode:function(e){var _54=e.target||e.srcElement;if(dojo.hasClass(_54,"graphIconContainer")){return _54;}else{if(dojo.hasClass(_54,"graphIcon")||dojo.hasClass(_54,"graphText")){return _54.parentNode;}}return null;},destroyComponent:function(){dojo.forEach(this.events,dojo.disconnect);for(var _55 in this){if(typeof _55=="function"){continue;}if(this[_55].destroyRecursive){this[_55].destroyRecursive(true);}this[_55]=null;delete this[_55];}},setDrawboard:function(db){this.drawboard=db;},getDrawboard:function(){if(!this.drawboard){new common.exception.Exception({msg:"the drawboard doesn't exist!"});return;}return this.drawboard;},doclick:function(e){var _56=this.getGraphNode(e),_57,_58,db,_59={},tmp,_5a=false;if(!_56){return;}_57=this.clickCss;_58=this.active;if(dojo.hasClass(_56,_57)||_58==_56){return;}_58&&(dojo.removeClass(_58,_57));dojo.addClass(_56,_57);db=this.getDrawboard();db.setDrawType(dojo.attr(_56,"strategy"));tmp=dojo.attr(_56,"url");if(tmp){_59.url=tmp;tmp=dojo.attr(_56,"ratio");tmp&&(_59.ratio=tmp);_5a=true;}_5a&&db.setGraphStrategyParam(_59);this.active=_56;},domousemove:function(e){var _5b=this.getGraphNode(e),_5c=this.overCss,_5d=this.overNode;if(!_5b){_5d&&(dojo.removeClass(_5d,_5c));this.overNode=null;return;}if(dojo.hasClass(_5b,_5c)||_5d==_5b){return;}_5d&&(dojo.removeClass(_5d,_5c));dojo.addClass(_5b,_5c);this.overNode=_5b;}});}if(!dojo._hasResource["window.widget.ToolbarContainer"]){dojo._hasResource["window.widget.ToolbarContainer"]=true;dojo.provide("window.widget.ToolbarContainer");dojo.declare("window.widget.ToolbarContainer",[dijit._Widget,dijit._Templated],{templateString:"<div dojoAttachPoint=\"toolbar\" class=\"toolbar\">\r\n\t<div dojoAttachPoint=\"floatDiv\" class=\"toolbarFloatCover\"></div>\r\n\t<div dojoAttachPoint=\"containerNode\" class=\"toolbarContainer\"></div>\r\n</div>\r\n",contentBuilder:null,contentBuilderClass:"window.widget._ToolbarBuilder",floatDivAnimate:null,events:null,drawboard:null,widthUnit:36,left:3,top:3,postCreate:function(){this.inherited(arguments);this.contentBuilder=eval("new "+this.contentBuilderClass+"(this)");this.createContent();var _5e=this.floatDiv;_5e.style.display="none";this.floatDivAnimate=dojo.animateProperty({node:this.floatDiv,duration:1000,properties:{}});this.events=[dojo.connect(this.containerNode,"onclick",this,this.doContentEvent),dojo.connect(this.containerNode,"onmousemove",this,this.doContentEvent)];},createContent:function(){this.containerNode.innerHTML=this.contentBuilder.generateHTML();},getDefinition:function(){if(!this.definition){this.createDefinition();}return this.definition;},setDrawboard:function(db){this.drawboard=db;},getDrawboard:function(){if(!this.drawboard){new common.exception.Exception({msg:"the drawboard doesn't exist!"});return;}return this.drawboard;},createDefinition:function(){this.definition=new dojo.data.ItemFileReadStore({url:drawboardRuntimeSetting.toolbarImgUrl});this.definition._forceLoad();},doContentEvent:function(e){e.dispatch="do"+e.type;this._dispatch(e.dispatch,e);},_dispatch:function(m,e){if(m in this){return this[m](e);}return false;},getMenuNode:function(e){var _5f=e.target||e.srcElement;if(dojo.hasClass(_5f,"toolbarDiv")){return _5f.firstElementChild||_5f.childNodes.item(0);}if(dojo.hasClass(_5f,"toolbarIcon")){return _5f;}return null;},doclick:function(e){var _60=this.getMenuNode(e),_61;if(!_60){return;}_61=dojo.attr(_60,"action");this.drawboard[dojo.trim(_61)]();},domousemove:function(e){var _62=this.getMenuNode(e),_63,_64,_65,_66,s;if(!_62){return;}_63=parseInt(dojo.attr(_62,"index"));_64=this.floatDivAnimate;_64.stop();_65=this.floatDivAnimate.properties,_66=_65.left;s=this.floatDiv.style;s.display="none";if(!_66){_65.left={};_65.left.start=_65.left.end=this.widthUnit*_63+this.left;s.left=this.left+"px";s.top=this.top+"px";return;}_65.left.start=_66.end;_65.left.end=this.widthUnit*_63+this.left;_64.play();return;},destroyComponent:function(){dojo.forEach(this.events,dojo.disconnect);for(var _67 in this){if(typeof _67=="function"){continue;}if(this[_67].destroyRecursive){this[_67].destroyRecursive(true);}this[_67]=null;delete this[_67];}}});window.widget._ToolbarBuilder=dojo.extend(function(_68){this.view=_68;},{view:null,zIndex:900,_table:"<ul class=\"toolbarUL\">",constructor:function(_69){this.view=_69;},generateHTML:function(){var _6a=[this._table],_6b=this.view.getDefinition()._arrayOfAllItems[0],img;if(!_6b){return "";}dojo.forEach(_6b.children,function(_6c,_6d){if(_6c){img=["<li class=\"toolbarDiv\">"];img.push(this.generateIMG(_6c,_6d));img.push("</li>");_6a.push(img.join(" "));}},this);_6a.push("</ul>");return _6a.join(" ");},generateIMG:function(_6e,_6f){var _70=["<img index=",_6f," class='toolbarIcon ",_6e.css[0],"'"," title='",_6e.title?_6e.title[0]:_6e.name[0],"'"," action='",_6e.action[0],"'"," src='",drawboardRuntimeSetting,"'","/>"];return _70.join(" ");}});}if(!dojo._hasResource["drawboard.cache.ResourceCache"]){dojo._hasResource["drawboard.cache.ResourceCache"]=true;dojo.provide("drawboard.cache.ResourceCache");(function(){dojo.declare("drawboard.cache.ResourceCache",common.Cache,{createCache:function(){return {};},getResource:function(key){return this.getCache()[key];},addResource:function(key,_71){var _72=this.getCache();_72[key]=_71;},removeResource:function(key){var _73=this.getCache();_73[key]=null;delete _73[key];}});if(drawboard.resourceCenter==null){drawboard.resourceCenter=new drawboard.cache.ResourceCache();}})();}if(!dojo._hasResource["drawboard.graphic.CanvasGraphic"]){dojo._hasResource["drawboard.graphic.CanvasGraphic"]=true;dojo.provide("drawboard.graphic.CanvasGraphic");(function(){var _74=drawboard.Constant.Path,_75=window.location.pathname,_76=_75.substring(0,_75.indexOf("/",1)+1);dojo.declare("drawboard.graphic.CanvasGraphic",null,{anchor:null,ctx:null,getContext:function(){if(!this.ctx){this.ctx=this.anchor.getContext("2d");}return this.ctx;},createAnchor:function(w,h){var _77=dojo.create("canvas");w&&_77.setAttribute("width",w);h&&_77.setAttribute("height",h);_77.wkWidget=this;this.anchor=_77;return _77;},setSize:function(w,h){var _78=this.anchor;dojo.attr(_78,"height",h);dojo.attr(_78,"width",w);},setStyle:function(ct,_79){if(!_79){return;}var _7a=_79.split(";"),s,_7b=[],_7c;dojo.forEach(_7a,function(_7d){s=_7d.split(":");switch(s[0]){case "fill":ct.fillStyle=s[1];_7c="fill";break;case "stroke":ct.strokeStyle=s[1];_7c="stroke";break;case "stroke-width":ct.lineWidth=s[1];_7c=null;break;case "":break;default:break;}(s[1]!="none")&&_7c&&_7b.push(_7c);},this);return function(){var pct=ct;dojo.forEach(_7b,function(_7e){pct[_7e]();},this);};},setAttrs:function(ct,_7f){if(_7f){var _80,_81;for(_80 in _7f){if(_80=="transform"){dojo.forEach(_7f[_80],function(opt){_81=opt.indexOf("rotate");if(_81!=-1){opt.substr(rindex,opt.length-2-_81);return;}eval("ct."+opt+";");},this);}}}},drawLine:function(p1,p2,_82){var ct=this.getContext(),_83=this.setStyle(ct,_82);ct.moveTo(p1.x,p1.y);ct.lineTo(p2.x,p2.y);_83();},drawRect:function(_84,w,h,rx,_85,_86){var ct=this.getContext(),_87;ct.save();_87=this.setStyle(ct,_86);this.setAttrs(_85);ct.moveTo(_84.x+(w>0?rx:-rx),_84.y);ct.arcTo(_84.x+w,_84.y,_84.x+w,_84.y+h-rx,rx);ct.arcTo(_84.x+w,_84.y+h,_84.x+rx,_84.y+h,rx);ct.arcTo(_84.x,_84.y+h,_84.x,_84.y+rx,rx);ct.arcTo(_84.x,_84.y,_84.x+(w>0?rx:-rx),_84.y,rx);_87();ct.restore();},drawCircle:function(_88,r,_89){var ct=this.getContext(),_8a=this.setStyle(ct,_89);ct.beginPath();ct.arc(_88.x,_88.y,r,0,Math.PI*2,true);ct.closePath();_8a();},drawPath:function(_8b,_8c,_8d){var ct=this.getContext(),p,_8e=this.setStyle(ct,_8c);ct.beginPath();dojo.forEach(_8b,function(_8f,_90){p=_8f.points;switch(_8f.command){case _74.MOVE:case _74.RMOVE:ct.moveTo(p.x,p.y);break;case _74.LINE:case _74.RLINE:ct.lineTo(p.x,p.y);break;case _74.NONE:default:break;}},this);!_8d&&ct.closePath();_8e();},drawImage:function(_91,w,h,url,_92){var ct=this.getContext(),_93=drawboard.resourceCenter.getCache();ct.save();this.setAttrs(ct,_92);if(_93[url]){ct.drawImage(_93[url],_91.x,_91.y,w,h);}else{var img=new Image();img.onload=function(){ct.drawImage(img,_91.x,_91.y,w,h);_93[url]=img;};img.src=_76+url;}ct.restore();},clear:function(){var ct=this.getContext(),_94=ct.canvas;ct.clearRect(0,0,_94.width,_94.height);}});})();}if(!dojo._hasResource["window.Entrance"]){dojo._hasResource["window.Entrance"]=true;dojo.provide("window.Entrance");(function(){var _95=common.calc.Geometry,_96=_95.rotation;window.Entrance={graphic:null,test:function(){this.graphic=drawboard.graphic.SVGGraphic;this.testGraphClassPanel();},createDrawboard:function(){var db=this.db,box=common.utils.BrowerUtils.getWindowBox(),div;if(!db){div=dojo.create("div",{},dojo.byId("graphNode"));div.style.width=box.w-191+"px";div.style.height=box.h-39+"px";div.style.border="1px solid black";this.db=new drawboard.DrawBoard({w:(box.w-191),h:(box.h-39),graphicClass:drawboard.graphic.SVGGraphic},dojo.create("div",null,div));}return this.db;},getZoomWindow:function(){if(!this.zoomWindow){var box=common.utils.BrowerUtils.getWindowBox(),db=this.createDrawboard(),div=dojo.create("div",{},dojo.byId("graphNode"),"last");div.style.height=db.h*0.5+4+"px";div.style.width=db.w*0.5+4+"px";div.style.border="1px solid black";div.style.position="relative";this.zoomWindow=new drawboard.ZoomDrawBoard({drawboard:db,w:db.w*0.5,h:db.h*0.5},dojo.create("div",{},div));}return this.zoomWindow;},testGraphClassPanel:function(){var box=common.utils.BrowerUtils.getWindowBox(),db=this.createDrawboard();dojo.byId("graphNode").style.width=(box.w-192)+"px";dojo.byId("graphNode").style.height=(box.h-30)+"px";new window.widget.GraphChooseContainer({width:"192px",height:(box.h-30)+"px",drawboard:db},dojo.create("div",null,dojo.byId("toolsNode")));new window.widget.Toolbar({drawboard:db},dojo.create("div",null,dojo.byId("navigator")));}};})();}
