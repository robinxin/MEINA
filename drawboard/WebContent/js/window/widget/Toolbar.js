dojo.provide("window.widget.Toolbar");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Toolbar");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.ColorPalette");
dojo.require("drawboard.Constant");
dojo.require("dijit.Menu");
dojo.require("window.widget.TextDialogue");
dojo.declare("window.widget.Toolbar",[dijit._Widget,dijit._Templated],{
	/*String*/templateString:"<div><span dojoAttachPoint='toolbarContainer'></span></div>",
	/*Drawboard*/drawboard:null,
	/*void*/postCreate:function(){
		var toolbar = new dijit.Toolbar({}, this.toolbarContainer),
			items = this.getDefinition()._arrayOfAllItems[0].children,
			type = drawboard.Constant.Toolbar,temp,name,
			that = this,list,funct;
		dojo.forEach(items, function(item){
			name = item.name[0];
			funct = dojo.hitch(that,item.action[0]);
			switch(item.type && item.type[0]){
				case type.COLORPALETTE:
					temp = new dijit.form.DropDownButton({
						label:name,
						title:name,
						showLabel:true,
						// iconClass: "toolbarIcon ",
						dropDown:new dijit.ColorPalette({
							drawboard:that.drawboard,
							palette:"7x10",
							onChange:funct
						})
					});
					break;
				case type.DROPDOWNLIST:
					list = item.list;
					if(!(list instanceof Array)){
						var start = list.start,
							end = list.end,
							list = [];
						while(start <= end){
							list.push(start);
							start++;
						}
					}
					temp = that.createDropDownList(list,that[item.action[0]], name);
					break;
				case type.DIALOGUE:
					temp = new dijit.form.Button({
		                // note: should always specify a label, for accessibility reasons.
		                // Just set showLabel=false if you don't want it to be displayed normally
		                label: name,
		                showLabel: false,
		                title:name,
		                iconClass: "dijitEditorIcon dijitEditorIcon toolbarIcon " + item.css[0],
						onClick:funct
		            });
					break;
				default:
					temp = new dijit.form.Button({
		                // note: should always specify a label, for accessibility reasons.
		                // Just set showLabel=false if you don't want it to be displayed normally
		                label: name,
		                showLabel: false,
		                title:name,
		                iconClass: "dijitEditorIcon dijitEditorIcon toolbarIcon " + item.css[0],
						onClick:funct
		            });
					break;
			}
			temp && toolbar.addChild(temp);
			temp = null;
		});
	},

	/*void*/strokeWidth:function(/*Event*/e){
		this.toolbar.drawboard.setStyle("stroke-width",this.label);
	},
	/*void*/stroke:function(/*Event*/e){
		this.drawboard.setStyle("stroke",e);
	},
	/*void*/fill:function(/*Event*/e){
		this.drawboard.setStyle("fill",e);
	},
	/*void*/combine:function(/*Event*/e){
		this.drawboard.combine();
	},
	/*void*/divide:function(/*Event*/e){
		this.drawboard.divide();
	},
	/*void*/next:function(/*Event*/e){
		this.drawboard.redo();
	},
	/*void*/previous:function(/*Event*/e){
		this.drawboard.undo();
	},
	/*void*/save:function(/*Event*/e){
		//nothing
	},
	/*void*/text:function(/*Event*/e){
		var db = this.drawboard;
		db.setStatus(null, null, drawboard.Constant.ActionStatus.TEXT);
	},
	/*void*/fontColor:function(/*Event*/e){
		this.drawboard.setStyle("fill",e,true);
	},
	/*void*/fontSize:function(/*Event*/e){
		this.toolbar.drawboard.setStyle("font-size",this.label + "px",true);
	},
	/*void*/fontFamily:function(/*Event*/e){
		this.toolbar.drawboard.setStyle("font-family",this.label,true);
	},
	/*void*/showContact:function(/*Event*/e){
		var text = "QQ:65265800";
		new window.widget.TextDialogue({text:text}).show();
	},
	/*void*/createDropDownList:function(itemList,funct,defaultValue){
		var menu = new dijit.Menu({
            style: "display: none;"
        }),
			that = this;
		dojo.forEach(itemList,function(item){
			 var menuItem =  new dijit.MenuItem({
				label:item,
				name:item,
				onClick:funct,
				toolbar:that
			 });
			 menu.addChild(menuItem);
		},this);
		return new dijit.form.DropDownButton({
	          label:defaultValue,
	          dropDown: menu
	      });
	},
	/*void*/createDefinition:function(){
		this.definition = new dojo.data.ItemFileReadStore({url:drawboardRuntimeSetting.toolbarImgUrl});
		this.definition._forceLoad();
	},
	/*ItemFileReadStore*/getDefinition:function(){
		if(!this.definition){
			this.createDefinition();
		}
		return this.definition;
	}
});
