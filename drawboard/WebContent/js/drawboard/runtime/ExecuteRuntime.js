dojo.provide("drawboard.runtime.ExecuteRuntime");
dojo.require("drawboard.context.ExecuteContext");
dojo.require("common.exception.Exception");
dojo.require("common.listener.Listener");
dojo.require("common.Cache");
dojo.require("dijit._Widget");
dojo.declare("drawboard.runtime.ExecuteRuntime",[dijit._Widget,common.Cache,common.listener.Listener],{
	/*ExecuteContext*/context:null,
	/*Graphic*/graphic:null,
	/*boolean*/_showMark:false,
    /*void*/setShowMark:function(/*boolean*/showMark){
		this._showMark = showMark;
	},
	/*boolean*/getShowMark:function(){
		return this._showMark;
	},
	/*void*/apply:function(/*String*/functName,/*Array<Object>*/params){
		this[functName] && this[functName].apply(this,params);
	},
	/**
	 * create cache by subclass
	 */
	/*Object*/createCache:function(){
		return {};
	},
	/**
	 * according to the instance to choose difference class
	 */
	/*Object*/getCache:function(/*GraphProxy*/gp){
		var cache = drawboard.runtime.ExecuteRuntime.superclass.getCache.apply(this),
			item = cache[gp.getIdty()];
		(!item)&&(cache[gp.getIdty()] = item = {});
		return item;
	},
	/**
	 * add cache
	 */
	/*void*/addCache:function(/*GraphProxy*/gp,/*Constant*/type,/*Object*/value){
		var cache = drawboard.runtime.ExecuteRuntime.superclass.getCache.apply(this),
			item = cache[gp.getIdty()];
		(!item)&&(cache[gp.getIdty()] = item = {});
		item[type] = value;
	},
	/**
	 * clear cache
	 */
	/*void*/clearCache:function(/*GraphProxy*/gp,/*Constant*/type){
		var cache = drawboard.runtime.ExecuteRuntime.superclass.getCache.apply(this);
		if(type !== undefined && type !== null){
			var item = cache[gp.getIdty()]; 
			if(item){ 
				item[type] = null;
				delete item[type];
			}
			this.fireListener(["clearCache",[gp,type]]);
			return;
		}
		cache[gp.getIdty()] = null;
		delete cache[gp.getIdty()];
		this.fireListener(["clearCache",[gp]]);
	},
	/*ExecuteContext*/getContext:function(){
		if(!this.context){
			new common.exception.Exception({msg:"the context in runtime doesnt' exist!"});
		}
		return this.context;
	},
	/*void*/setContext:function(/*ExecuteContext*/context){
		this.context = context;
	},
	/*Graphic*/getGraphic:function(){
		if(!this.graphic){
			new common.exception.Exception({msg:"the graphic in runtime doesnt' exist!"});
		}
		return this.graphic;
	},
	/*void*/setGraphic:function(/*Graphic*/gf){
		this.graphic = gf;
	},
	/*Double*/getDistance:function(){
		var ctx = this.getContext();
		return ctx.getParamsCtrl().getDistance();
	},
	/*Double*/getRotateDistance:function(){
		var ctx = this.getContext();
		return ctx.getParamsCtrl().getRotateDistance();
	},
	/*void*/getRounder:function(){
		var ctx = this.getContext();
		return ctx.getParamsCtrl().getRounder();
	},
	/*DrawProcessor*/getDrawProcessor:function(){
		return this.getContext().getDrawProcessor();
	},
	/*void*/draw:function(/*GraphProxy*/gp){
		this.getDrawProcessor().draw(gp,this);
	},
	/*void*/zoom:function(/*GraphProxy*/gp,/*{x:Double,y:Double}*/rate){
		gp.zoom(rate,this);
	}
});