dojo.provide("window.widget.GraphChooseContainer");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("common.exception.Exception");
dojo.declare("window.widget.GraphChooseContainer",[dijit._Widget,dijit._Templated],{
	/*String*/templateString:"<div></div>",
	/*ItemFileReadStore*/definition:null,
	/*AccordionContainer*/accordion:null,
	/*Double*/width:null,
	/*Double*/height:null,
	/*Node*/active:null,
	/*DrawBoard*/drawboard:null,
	/*Node*/overNode:null,
	/*String*/clickCss:"graphClick",
	/*String*/overCss:"graphOver",
	/*Array*/events:null,
	/*void*/postCreate:function(){
		var style = [],host = this;
		(this.width)&&(style.push("width:" + this.width + ";"));
		(this.height)&&(style.push("height:" + this.height + ";"));
		 var accordion = new dijit.layout.AccordionContainer({
			style:style.join(" ")
		}).placeAt(this.domNode);
		dojo.connect(accordion,"_showChild",function(){
			host.clearStatus();
		});
		accordion.startup(); 
		this.accordion = accordion;
		this.createContent();
		dojo.subscribe("/drawboard/mouseup",dojo.hitch(this,"clearStatus"));
		this.events = [dojo.connect(this.domNode,"onclick",this,this.doclick),
		               dojo.connect(this.domNode,"onmousemove",this,this.domousemove)];
	},
	/*void*/clearStatus:function(){
		var db = this.drawboard;
		db && db.setDrawType(null);
		var node = this.active;
		if(node){
			dojo.removeClass(node,this.clickCss);
			this.active = null;
		}
	},
	/*ItemFileReadStore*/getDefinition:function(){
		if(!this.definition){
			this.createDefinition();
		}
		return this.definition;
	},
	/*void*/createDefinition:function(){
		this.definition = new dojo.data.ItemFileReadStore({url:drawboardRuntimeSetting.graphImgUrl});
		this.definition._forceLoad();
	},
	/*void*/createContent:function(){
		var definiton = this.getDefinition(),
			root = definiton._arrayOfAllItems[0],
			createGraphContent = this.createGraphContent;
		dojo.forEach(root.children,function(graphParent,index){
		 	createGraphContent.call(this,graphParent, index);
		},this);
	},
	/*void*/createGraphContent:function(graphParent,index){
		var content = new dijit.layout.ContentPane({title: graphParent.name[0]});
			content.containerNode.innerHTML = this.generateGraphContent(graphParent);
			this.accordion.addChild(content);
	},
	/*String*/generateGraphContent:function(parent){
		var html = [],graphItem;
		dojo.forEach(parent.children,function(item){
			graphItem = ["<div id=",item.id[0]," name=",item.name[0]," title=",item.name[0],"","",""," strategy='",item.strategy[0],"' class='graphIconContainer'><img src='",drawboardRuntimeSetting.blankGif,"' class='graphIcon ",(parent.css||"")," ",item.css[0],"'/>","<span class='graphText'>",item.name[0],"</span></div>"];
			item.url && (graphItem[6] = " url='" + item.url[0] + "'");
			item.ratio && (graphItem[7] = " ratio='" + item.ratio[0] + "'");
			item.affectedByZoom && (graphItem[8] = " affectedByZoom='" + item.affectedByZoom[0] + "'");
			html.push(graphItem.join(" "));
		},this);
		return html.join(" ");
	},
	/*Node*/getGraphNode:function(/*Event*/e){
		var node = e.target||e.srcElement;
		if(dojo.hasClass(node,"graphIconContainer")){
			return node;
		}else if(dojo.hasClass(node,"graphIcon")||dojo.hasClass(node,"graphText")){
			return node.parentNode;
		}
		return null;
	},
	/*void*/destroyComponent:function(){
		dojo.forEach(this.events,dojo.disconnect);
		for(var attr in this){
			if(typeof attr == "function"){
				continue;
			}
			if(this[attr].destroyRecursive){
				this[attr].destroyRecursive(true);
			}
			this[attr] = null;
			delete this[attr];
		}
	},
	/*void*/setDrawboard:function(/*Drawboard*/db){
		this.drawboard = db;
	},
	/*Drawboard*/getDrawboard:function(){
		if(!this.drawboard){
			new common.exception.Exception({msg:"the drawboard doesn't exist!"});
			return;
		}
		return this.drawboard;
	},
	/***********************************************
	 * 					event operation
	 * *********************************************/
	/*void*/doclick:function(/*Event*/e){
		var node = this.getGraphNode(e),clickCss,active,db,param = {},tmp,hasParam = false;
		if(!node){
			return;
		}
		clickCss = this.clickCss;
		active = this.active;
		if(dojo.hasClass(node,clickCss)||active == node){
			return;
		}
		active && (dojo.removeClass(active,clickCss));
		dojo.addClass(node,clickCss);
		db = this.getDrawboard();
		db.setDrawType(dojo.attr(node,"strategy"));
		tmp = dojo.attr(node,"url");
		if(tmp){
			//var host = drawboardRuntimeSetting.host;
			//param.url = host?host.substr(3,host.lastIndexOf("/")-2) + tmp :tmp;
			param.url = tmp;
			tmp = dojo.attr(node,"ratio");
			tmp && (param.ratio = tmp);
			hasParam = true;
		}
		tmp = dojo.attr(node,"affectedByZoom");
		tmp && ((param.affectedByZoom = tmp) || (hasParam = true));
		hasParam && db.setGraphStrategyParam(param);
		this.active = node;
	},
	 /*void*/domousemove:function(/*Event*/e){
		var node = this.getGraphNode(e),
			overCss = this.overCss,
			overNode = this.overNode;;
		if(!node){
			overNode && (dojo.removeClass(overNode,overCss));
			this.overNode = null;
			return;
		}
		if(dojo.hasClass(node,overCss)||overNode == node){
			return;
		}
		overNode && (dojo.removeClass(overNode,overCss));
		dojo.addClass(node,overCss);
		this.overNode = node;
	}
});