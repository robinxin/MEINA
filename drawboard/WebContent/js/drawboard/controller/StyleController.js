dojo.provide("drawboard.controller.StyleController");
dojo.require("common.container.MapContainer");
(function(){
dojo.declare("drawboard.controller.StyleController",common.container.MapContainer,{
	/*String*/_style:"fill:none;stroke:black;stroke-width:1",			//default style information
	/*String*/_activeStyle:"fill:none;stroke:red;stroke-width:1",
	/*String*/resultIdentity:"serializeStr",
	/*Array<Decorate>*/actives:null,
	/*GraphProxy*/activedGp:null,
	/*void*/setActives:function(/*Array<Decorate>*/actives,/*GraphProxy*/gp){
		this.actives = actives;
		this.activedGp && this.activedGp.isActived(false);
		gp && gp.isActived(true)&&(this.activedGp = gp);
	},
	/*Array<Decorate>*/getActives:function(){
		return this.actives;
	},
	/*void*/init:function(/*String*/style){
		this._style = style;
	},
	/*String*/getDefaultStyle:function(){
		return this._style;
	},
	//because the text default style is different of graph style.
	/*String*/getTextStyle:function(/*GraphProxy*/gp){
		var gs = this.getItem(gp.getIdty());
		if(!gs){return "";}
		return gs[this.resultIdentity];
	},
	/**
	 * get graph style
	 * @param gp
	 */
	/*String*/getGraphStyle:function(/*GraphProxy*/gp){
		var gs = this.getItem(gp.getIdty());
		if(!gs){return this.getDefaultStyle(gp);}
		return gs[this.resultIdentity];
	},
    /*String*/getGraphStyleValue:function(/*GraphProxy*/gp,/*String*/styleAttr){
		var styleStr = this.getItem(gp.getIdty());
		if(styleStr){
			return styleStr[styleAttr];
		}
		return null;
	},
	/*boolean*/containGraphStyle:function(/*GraphProxy*/gp){
		var gs = this.getItem(gp.getIdty());
		if(!gs){
			return false;
		}
		return true;
	},
	/**
	 * add graph  specific style
	 * @param gp
	 * @param styleAttr
	 * @param style
	 */
	/*void*/addGraphStyle:function(/*GraphProxy*/gp,/*String*/styleAttr,/*String*/style,/*boolean*/isText){
		if(gp.isComposite()){
			return;
		}
		var gs = this.getItem(gp.getIdty());
		if(!gs){
			gs = {};
			this.addItem(gp.getIdty(),gs);
		}
		gs[styleAttr] = style;
		gs[this.resultIdentity] = this.serialize(gs,isText);
	},
	/**
	 * remove graph specify style
	 */
	/*void*/removeGraphStyle:function(/*GraphProxy*/gp,/*String*/styleAttr){
		if(gp.isComposite()){
			return;
		}
		var gs = this.getItem(gp.getIdty());
		if(!gs || !gs[styleAttr]){return;}
		delete gs[styleAttr];
		gs[this.resultIdentity] = this.serialize(gs);
	},
	/**
	 * remove graph style
	 */
	/*void*/removeGraph:function(/*GraphProxy*/gp){
		var idty = gp.getIdty(),
			gs = this.getItem(idty);
		if(!gs){return;}
		this.removeItem(idty);
	},
	/**
	 * generate style string
	 * @param sj
	 */
	/*String*/serialize:function(/*JSON*/sj,/*boolean*/isText){
		var str = [];
		for(var attr in sj){
			if(attr != this.resultIdentity){
				str.push([attr,":",sj[attr]].join(""));
			}
		}
		if(!isText){			
			if(!sj["stroke"]){
				str.push(["stroke",":","black"].join(""));
			}
			if(!sj["stroke-width"]){
				str.push(["stroke-width",":","1"].join(""));
			}
			if(!sj["fill"]){
				str.push(["fill",":","none"].join(""));
			}
		}
		return str.join(";");
	},
	/*String*/getStyle:function(/*Constant*/type,/*GraphProxy*/gp,/*Decorate*/d){
		var actives = this.getActives(),isActive = false;
		if(d && actives){
			dojo.some(actives,function(active){
				if(active.equal(d)){
					isActive = true;
				}
			},this);
			if(isActive){
				return this._activeStyle;
			}
		}
		return this.getGraphStyle(gp);
	}
});
})();