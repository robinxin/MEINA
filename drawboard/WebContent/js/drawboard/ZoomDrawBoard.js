dojo.provide("drawboard.ZoomDrawBoard");
dojo.require("drawboard.graphic.SVGGraphic");
dojo.require("drawboard.graph.GraphProxy");
dojo.require("drawboard.controller.StyleController");
dojo.require("drawboard.controller.ParamsController");
dojo.require("drawboard.drawProcessor.ZoomDrawProcessor");
dojo.require("drawboard.context.ExecuteContext");
dojo.require("drawboard.runtime.ExecuteRuntime");
dojo.require("common.exception.Exception");
dojo.require("common.calc.Geometry");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
(function(){
var geometry = common.calc.Geometry,
	mouseStatus = drawboard.Constant.MouseAction,	
	subtract = geometry.subtract2Points;
dojo.declare("drawboard.ZoomDrawBoard",[dijit._Widget,dijit._Templated],{
	/*String*/templateString:"<div style='position:relative;overflow:hidden;'><div dojoAttachPoint='zoomDrawboard'></div><div dojoAttachPoint='zoomRect' style='position:absolute;border:2px solid red;left:0px;top:0px;'></div></div>",
	/*Class*/graphicClass:drawboard.graphic.SVGGraphic,
	/*Graphic*/_graphic:null,
	/*Node*/anchor:null,
	/*double*/w:null,
	/*double*/h:null,
	/*{x:double,y:double}*/_zoom:{x:100,y:100},
	/*double*/rectBorder:2,
	/*double*/defaultWidth:300,
	/*double*/defaultHeight:300,
	/*ExecuteContext*/_runtime:null,
	/*DrawBoard*/drawboard:null,
	/*Array*/events:null,
	/*{x:double,y:double}*/boxCache:null,
	/*boolean*/scopeSelf:false,
	
	/*void*/postCreate:function(){
		var graphic = this.createGraphic(),node,
			ctrller = drawboard.controller,ctx,
			db = this.getDrawBoard(),runtime,
			zoomRect = this.zoomRect,
			domNode = this.domNode,
			rectBorder = this.rectBorder,
			 w = this.w||this.defaultWidth,
			 h = this.h || this.defaultHeight;
		node = graphic.createAnchor(w,h);
		this.anchor = node;
		ctx = new drawboard.context.ExecuteContext({paramsCtrl:new ctrller.ParamsController(),
																styleCtrl:new ctrller.StyleController(),
																drawProcessor:new drawboard.drawProcessor.ZoomDrawProcessor(),
																zoom:{x:50,y:50}});
		this._runtime = runtime = new drawboard.runtime.ExecuteRuntime({context:ctx,graphic:graphic}); 
		this.zoomDrawboard.appendChild(this.anchor);
		zoomRect.style.width = w + "px";
		zoomRect.style.height = h + "px";
		domNode.style.width = w + (rectBorder<<1) + "px";
		domNode.style.height = h + (rectBorder<<1) + "px";
		this.events = [dojo.connect(zoomRect,"onmousemove",dojo.hitch(this,"doMouseMove")),
		               dojo.connect(zoomRect,"onmousedown",dojo.hitch(this,"doMouseDown")),
//		               dojo.connect(zoomRect,"onmouseout",dojo.hitch(this,"doMouseOut")),
		               dojo.connect(zoomRect,"onmouseup",dojo.hitch(this,"doMouseUp"))];
		db.addListener(this.apply,this);
		db.getRuntime().addListener(runtime.apply,runtime);
	},
	/**
	 * get draw board
	 * @returns
	 */
	/*DrawBoard*/getDrawBoard:function(){
		if(!this.drawboard){
			new common.exception.Exception({msg:"the draw board can't find in the zoom window!"});
		}
		return this.drawboard;
	},
	/**
	 * set draw board
	 * @param drawboard
	 */
	/*void*/setDrawBoard:function(/*DrawBoard*/drawboard){
		this.drawboard = drawboard;
	},
	/**
	 * set zoom
	 * @param rate
	 */
	/*boolean*/setZoom:function(/*{x:double,y:double}*/rate){
		var zoom = subtract(this._zoom,{x:rate.x,y:rate.y});
		if(zoom.x < 0 || zoom.y < 0 || zoom.x > 200 || zoom.y > 200){
			return false;
		}
		this._zoom = zoom;
		return true;
	},
	/**
	 * get zoom
	 * @returns {x:double,y:double}
	 */
	/*{x:double,y:double}*/getZoom:function(){
		return geometry.dividePoint(this._zoom,{x:100,y:100})[0];
	},
	/**
	 * get graphic
	 */
	/*Graphic*/getGraphic:function(){
		return this.getRuntime().getGraphic();
	},
	/**
	 * get execute runtime
	 * @return context
	 */
	/*ExecuteRuntime*/getRuntime:function(){
		return this._runtime;
	},
	/**
	 * set execute runtime
	 * @param context
	 */
	/*void*/setRuntime:function(/*ExecuteRuntime*/runtime){
		this._runtime = runtime;
	},
	/**
	 * create graphic
	 */
	/*Graphic*/createGraphic:function(){
		return new this.graphicClass();
	},
	/*void*/apply:function(/*String*/functName,/*Array<Object>*/params){
		this[functName] && this[functName].apply(this,params);
	},
	/**
	 * zoom out or zoom in
	 * @param rate
	 */
	/*void*/zoom:function(/*{x:Double,y:Double}*/rate){
		this._unitCache = null;
		if(!this.setZoom(rate)){
			return;
		}
		this.scopeSelf = true;
		var zoomRect = this.zoomRect,
			zoom = this.getDrawBoard().getRuntime().getContext().getZoom(),
			style = zoomRect.style,
			w = this.w,
			h = this.h,
			rw = w/(zoom.x),
			rh = h/(zoom.y);
		style.left = parseFloat(style.left) + (parseFloat(style.width)>>1) - (rw>>1) + "px";
		style.top = parseFloat(style.top) + (parseFloat(style.height)>>1) - (rh>>1)  + "px";
		style.width = rw + "px"; 
		style.height = rh + "px";
		this.draw();
	},
	/**
	 * draw graph
	 */
	/*void*/draw:function(){
		this.clearGraphs();
		var db = this.getDrawBoard();
		db.drawGraphs(this.getRuntime());
	},
	/**
	 * clear all graphs
	 */
	/*void*/clearGraphs:function(){
		var anchor = this.anchor;
		while(anchor.lastChild) 
		{
			anchor.removeChild(anchor.lastChild);
		}
	},
	/**
	 * get current drawboard panel box information
	 */
	/*void*/getBoxCache:function(){
		if(!this.boxCache){
			var node = this.domNode,
				cache = {left:node.offsetLeft,top:node.offsetTop};
			this.boxCache = cache;
		}
		return this.boxCache;
	},
	/**
	 * get the coordinate of current mouse position in the drawboard panel
	 */
	/*CoordinateFormatter*/fetchCoordinate:function(/*Event*/e){
		var box = this.getBoxCache(),domNode = this.domNode;
		return {x:e.pageX - box.left + domNode.scrollLeft,y:e.pageY - box.top + domNode.scrollTop};
	},
	/**
	 * unit px in the zoom mapping to the origin graph
	 */
	/*double*/getUnitPx:function(){
		if(!this._unitCache){
			var db = this.getDrawBoard(),
				dbSize = db.getCanvasSize(),
				oriSize = db.getUserViewSize(),
				style = this.zoomRect.style;
			this._unitCache = {x:(dbSize.x-oriSize.x)/(this.w - parseFloat(style.width)),y:(dbSize.y-oriSize.y)/(this.h - parseFloat(style.height))};
		}
		return this._unitCache;
	},
	/*************************************************************************
	 * 							Event
	 *************************************************************************/
	/*Constant*/status:mouseStatus.NONE,
	/*Coordinate*/_start:null,
	/*Coordinate*/_end:null,
	/*double*/_loseAccuracyLeft:0,
	/*double*/_loseAccuracyTop:0,
	/*integer*/_accuracy:100000,
	/*void*/doMouseMove:function(e){
		if(this.status != mouseStatus.MOUSEDOWN && this.status != mouseStatus.MOUSEMOVE){
			return;
		}
		var end = this.fetchCoordinate(e),
			delta = subtract(end,this._start),
			style = this.zoomRect.style,
			db = this.getDrawBoard(),
			dbNode = db.domNode,
			unit = this.getUnitPx(),temp,
			accuracy = this._accuracy,
			top = parseFloat(style.top) + delta.y,
			left = parseFloat(style.left) + delta.x,
			dbSize = db.getCanvasSize(),
			oriSize = db.getUserViewSize(),
			rWidth = parseFloat(style.width),
			rHeight = parseFloat(style.height);
		this._start = end;
//		if(top < 0 || left <0 || (left + parseFloat(style.width)) - 1 > this.w || (top + parseFloat(style.height)) - 1 > this.h){
//			return;
//		}
		(top<0)&&(top=0);
		(left<0)&&(left=0);
		this.scopeSelf = true;
		style.top = top + "px";
		style.left = left + "px";
		//for the scrollLeft and scrollTop in the node must be integer,so we must add the loss accuracy.Control the relative error in 1 px.
		if(left == 0){
			dbNode.scrollLeft = 0;
			this._loseAccuracyLeft = 0;
		}else if((left + rWidth)> this.w){
			dbNode.scrollLeft = dbSize.x-oriSize.x;
			style.left = this.w - rWidth + "px";
		}else{
			dbNode.scrollLeft = temp = dbNode.scrollLeft + delta.x*unit.x;
			temp = (temp * accuracy - parseInt(temp) * accuracy)/accuracy;
			this._loseAccuracyLeft = temp = this._loseAccuracyLeft + temp;
			if(temp >= 1){
				dbNode.scrollLeft += 1;
				this._loseAccuracyLeft = temp - 1;
			}
		}
		if(top == 0){
			dbNode.scrollTop = 0;
			this._loseAccuracyTop = 0;
		}else if((top + rHeight)> this.h){
			dbNode.scrollTop = dbSize.y-oriSize.y;
			style.top = this.h - rHeight + "px";
		}else{
			dbNode.scrollTop = temp = dbNode.scrollTop + delta.y*unit.y;
			temp = (temp * accuracy - parseInt(temp) * accuracy)/accuracy;
			this._loseAccuracyTop = temp = this._loseAccuracyTop + temp;
			if(temp >= 1){
				dbNode.scrollTop += 1;
				this._loseAccuracyTop = temp - 1;
			}
		}
		this.status = mouseStatus.MOUSEMOVE;
	},
	/*void*/doMouseDown:function(e){
		this._start = this.fetchCoordinate(e);
		this.status = mouseStatus.MOUSEDOWN;
	},
	/*void*/doMouseUp:function(e){
		this.status = mouseStatus.MOUSEUP;
	},
//	/*void*/doMouseOut:function(e){
//		this.status = mouseStatus.MOUSEOUT;
//	},
	/*void*/doScroll:function(/*boolean*/isHorizon,/*double*/delta){
		if(this.scopeSelf){
			this.scopeSelf = false;
			return;
		}
		var style = this.zoomRect.style,
			unit = this.getUnitPx();
		if(isHorizon){
			style.left = parseFloat(style.left) + delta/unit.x + "px";
		}else{
			style.top = parseFloat(style.top) + delta/unit.y + "px";
		}
	},
	/*void*/destroy:function(){
		dojo.forEach(this.events,dojo.disconnect);
	}
});
})();
