dojo.provide("window.widget.ToolbarContainer");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("common.exception.Exception");
dojo.declare("window.widget.ToolbarContainer",[dijit._Widget,dijit._Templated],{
	/*String*/templatePath:dojo.moduleUrl('window.widget', 'templates/toolbarContainer.html'),
	/*_Builder*/contentBuilder:null,
	/*String*/contentBuilderClass:"window.widget._ToolbarBuilder",
	/*animateProperty*/floatDivAnimate:null,
	/*Array*/events:null,
	/*Drawboard*/drawboard:null,
	/*Double*/widthUnit:36,
	/*Double*/left:3,
	/*Double*/top:3,
	/*void*/postCreate:function(){
		this.inherited(arguments);
		//create content builder
		this.contentBuilder = eval("new " + this.contentBuilderClass + "(this)");
		//create content
		this.createContent();
		var node = this.floatDiv;
		node.style.display = "none";
		this.floatDivAnimate = dojo.animateProperty(
			    {
				      node: this.floatDiv,duration: 1000,
				      properties: {
				      }
				    });
		this.events = [dojo.connect(this.containerNode,"onclick",this,this.doContentEvent),
		               dojo.connect(this.containerNode,"onmousemove",this,this.doContentEvent)];
	},
	/*void*/createContent:function(){
		this.containerNode.innerHTML = this.contentBuilder.generateHTML();
	},
	/*ItemFileReadStore*/getDefinition:function(){
		if(!this.definition){
			this.createDefinition();
		}
		return this.definition;
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
	/*void*/createDefinition:function(){
		this.definition = new dojo.data.ItemFileReadStore({url:drawboardRuntimeSetting.toolbarImgUrl});
		this.definition._forceLoad();
	},
	/*void*/doContentEvent:function(e){
		e.dispatch = 'do' + e.type;
		this._dispatch(e.dispatch,e);
	},
	/*void*/_dispatch:function(m,e){
		if(m in this){
			return this[m](e);
		}
		return false;
	},
	/*Node*/getMenuNode:function(e){
		var node = e.target || e.srcElement;
		if(dojo.hasClass(node,"toolbarDiv")){
			return node.firstElementChild||node.childNodes.item(0);
		}
		if(dojo.hasClass(node,"toolbarIcon")){
			return node;
		}
		return null;
	},
	/*void*/doclick:function(e){
		var node = this.getMenuNode(e),command;
		if(!node){
			return;
		}
		command = dojo.attr(node,"action");
		this.drawboard[dojo.trim(command)]();
	},
	/*void*/domousemove:function(e){
		var node = this.getMenuNode(e),index,floatDivAnimate,properties,left,s;
		if(!node){return;}
		index = parseInt(dojo.attr(node,"index"));
		floatDivAnimate = this.floatDivAnimate;
		floatDivAnimate.stop();
		properties = this.floatDivAnimate.properties,left=properties.left;
		s = this.floatDiv.style;
		s.display = "none";
		if(!left){
			properties.left = {};
			properties.left.start = properties.left.end = this.widthUnit * index + this.left; 
			s.left = this.left + "px";
			s.top = this.top + "px";
			return;
		}
		properties.left.start = left.end;
		properties.left.end = this.widthUnit * index + this.left;
		floatDivAnimate.play();
		return;
	},
	destroyComponent:function(){
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
	}
});
window.widget._ToolbarBuilder = dojo.extend(function(view){
	this.view = view;
	},{
	view:null,
	zIndex:900,
	_table:'<ul class="toolbarUL">',
	/*void*/constructor:function(view){
		this.view = view;
	},
	/*String*/generateHTML:function(){
		var html = [this._table],root = this.view.getDefinition()._arrayOfAllItems[0],img;
		if(!root){return "";}
		dojo.forEach(root.children,function(item,index){
			if(item){
				img = ['<li class="toolbarDiv">'];
				img.push(this.generateIMG(item,index));
				img.push('</li>');
				html.push(img.join(' '));
			}
		},this);
		html.push("</ul>");
		return html.join(' ');
	},
	/*String*/generateIMG:function(item,index){
		var span = ['<img index=',index,
		            " class='toolbarIcon ",item.css[0],"'",
		            " title='",item.title?item.title[0] : item.name[0],"'",
		            " action='",item.action[0],"'",
					" src='" , drawboardRuntimeSetting , "'",		          
		            "/>"];
		return span.join(' ');
	}
});
