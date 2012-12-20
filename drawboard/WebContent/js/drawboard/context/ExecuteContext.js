dojo.provide("drawboard.context.ExecuteContext");
dojo.require("common.calc.Geometry");
dojo.require("common.exception.Exception");
dojo.require("dijit._Widget");
(function(){
var geometry = common.calc.Geometry;
dojo.declare("drawboard.context.ExecuteContext",dijit._Widget,{
	/*{x:Double,y:Double}*/zoom:{x:100,y:100},
	/*ParamsController*/paramsCtrl:null,
	/*StyleController*/styleCtrl:null,
	/*CommandController*/commandCtrl:null,
	/*DrawProcessor*/drawProcessor:null,
	/**
	 * get zoom
	 * @returns {Number}
	 */
	/*{x:Double,y:Double}*/getZoom:function(){
		return geometry.dividePoint(this.zoom,{x:100,y:100})[0];
	},
	/**
	 * set zoom
	 * @param zoom
	 */
	/*boolean*/setZoom:function(/*{x:Double,y:Double}*/rate){
		var zoom = geometry.add2Points(this.zoom,rate);
		if(zoom.x < 0 || zoom.y < 0 || zoom.x > 200 || zoom.y > 200){
			return false;
		}
		this.zoom = zoom;
		return true;
	},
	/**
	 * get parameters controller
	 * @returns
	 */
	/*ParamsController*/getParamsCtrl:function(){
		if(!this.paramsCtrl){
			new common.exception.Exception({msg:"the parameters controller in context doesnt' exist!"});
		}
		return this.paramsCtrl;
	},
	/**
	 * set parameters controller
	 * @param paramsCtrl
	 */
	/*void*/setParamsCtrl:function(/*ParamsController*/paramsCtrl){
		this.paramsCtrl = paramsCtrl;
	},
	/**
	 * get command controller
	 * @returns
	 */
	/*CommandController*/getCommandCtrl:function(){
		if(!this.commandCtrl){
			new common.exception.Exception({msg:"the command controller in context doesnt' exist!"});
		}
		return this.commandCtrl;
	},
	/**
	 * set command controller
	 * @param commandCtrl
	 */
	/*void*/setCommandCtrl:function(/*CommandController*/commandCtrl){
		this.commandCtrl = commandCtrl;
	},
	/**
	 * set style controller
	 * @param styleCtrl
	 */
	/*void*/setStyleCtrl:function(/*StyleController*/styleCtrl){
		if(!this.styleCtrl){
			new common.exception.Exception({msg:"the style controller in context doesnt' exist!"});
		}
		this.styleCtrl = styleCtrl;
	},
	/**
	 * get style controller
	 * @returns
	 */
	/*StyleController*/getStyleCtrl:function(){
		return this.styleCtrl;
	},
	/**
	 * get draw processor
	 * @returns
	 */
	/*DrawProcessor*/getDrawProcessor:function(){
		if(!this.drawProcessor){
			new common.exception.Exception({msg:"the draw processor in context doesnt' exist!"});
		}
		return this.drawProcessor;
	},
	/**
	 * set draw processor
	 * @param drawProcessor
	 */
	/*void*/setDrawProcessor:function(/*DrawProcessor*/drawProcessor){
		this.drawProcessor = drawProcessor;
	}
});
})();