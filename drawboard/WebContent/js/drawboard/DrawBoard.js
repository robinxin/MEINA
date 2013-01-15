dojo.provide("drawboard.DrawBoard");
dojo.require("drawboard.PreRequire");
dojo.require("drawboard._Event");
dojo.require("drawboard._Selector");
dojo.require("drawboard.graphic.SVGGraphic");
dojo.require("drawboard.board.TextBoard");
dojo.require("drawboard.graph.GraphProxy");
dojo.require("drawboard.controller.StyleController");
dojo.require("drawboard.controller.ParamsController");
dojo.require("drawboard.drawProcessor.DbDrawProcessor");
dojo.require("drawboard.context.ExecuteContext");
dojo.require("drawboard.runtime.ExecuteRuntime");
dojo.require("drawboard.command.CompositeCommand");
dojo.require("drawboard.controller.CommandController");
dojo.require("common.calc.Geometry");
dojo.require("common.listener.Listener");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.declare("drawboard.DrawBoard",[dijit._Templated,drawboard._Selector,drawboard._Event,common.listener.Listener],{
	/*String*/templateString:"<div></div>",
	/*DomNode*/dbCanvas:null,
	/*Class*/graphicClass:drawboard.graphic.SVGGraphic,
	/*Class*/textBoardClass:drawboard.board.TextBoard,
	/*TextBoard*/_textBoard:null,
	/*Graphic*/_graphic:null,
	/*double*/w:null,
	/*double*/h:null,
	/*double*/defaultWidth:300,
	/*double*/defaultHeight:300,
	/*CompositeProxy*/_selectRect:null,
	/*ExecuteContext*/_runtime:null,
	/*Node*/fixNode:null,
	/*String*/SRGraphStrategyClass:"drawboard.graph.strategy.RectangleStrategy",
	/*String*/graphStrategyParam:null,
	/*{x:Double,y:Double,width:Double,height:Double}*/drawEntity:null,	//create a new graph,and draw.
	/*CompositeCommand*/_commands:null,
	
	/*void*/postCreate:function(){
		var graphic = this.createGraphic(),node,
			ctrller = drawboard.controller,
			ctx,dbCanvas,
			w = this.w,
			h = this.h,
			style = this.domNode.style;
		dbCanvas = dojo.create("div",{},this.domNode);
		style.overflow = "auto";
		style.width = w + "px";
		style.height = h + "px";
		style.position = "relative";
		this.dbCanvas = dbCanvas;
		node = graphic.createAnchor(w||this.defaultWidth,h || this.defaultHeight,dbCanvas);
		ctx = new drawboard.context.ExecuteContext({paramsCtrl:new ctrller.ParamsController(),
																styleCtrl:new ctrller.StyleController(),
																commandCtrl:new ctrller.CommandController(),
																drawProcessor:new drawboard.drawProcessor.DbDrawProcessor()
																});
		this._textBoard = new this.textBoardClass({"_db":this});
		this.domNode.appendChild(this._textBoard.domNode);
		this._runtime = new drawboard.runtime.ExecuteRuntime({context:ctx,graphic:graphic});
		//drawboard.DrawBoard.superclass.postCreate.call(this,node);
		drawboard.DrawBoard.superclass.postCreate.call(this,this.domNode);
	},
	/*boolean*/ready:function(){
		return this.getGraphic().ready();
	},
	/*TextBoard*/getTextBoard:function(){
		return this._textBoard;
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
	/*void*/setGraphStrategyParam:function(/*String*/param){
		this.graphStrategyParam = param;
	},
	/*String*/getGraphStrategyParam:function(){
		return this.graphStrategyParam;
	},
	/**
	 * create graphic
	 */
	/*Graphic*/createGraphic:function(){
		if(!this._graphic){
		    this._graphic = new this.graphicClass();
		}
		return this._graphic;
	},
	/**
	 * get drawing information
	 */
	/*void*/getDrawEntity:function(/*boolean*/create){
		if(!this.drawEntity && create){
			this.drawEntity = {};
		}
		return this.drawEntity;
	},
	/*{x:double,y:double}*/getCanvasSize:function(){
		var zoom = this.getRuntime().getContext().getZoom();
		return {x:this.w*zoom.x,y:this.h*zoom.y};
	},
	/**
	 * get use view size , when the scroll bar show , the width and height will less than origin. 
	 * So we get use view size by the clientWidth and clientHeight,not by the this.w and this.h
	 * @returns {x:double,y:double}
	 */
	/*{x:double,y:double}*/getUserViewSize:function(){
		var domNode = this.domNode;
		return {x:domNode.clientWidth,y:domNode.clientHeight};
	},
	/**
	 * clear drawing information
	 */
	/*void*/clearDrawEntity:function(/*boolean*/isSelect){
		var drawEntity = this.drawEntity,
			param = this.graphStrategyParam;
		if(drawEntity && !isSelect){
			var gs = new drawboard.graph.GraphStatus({_coordinate:{x:drawEntity.x,y:drawEntity.y},_w:drawEntity.width,_h:drawEntity.height,affectedByZoom:(param&&param.affectedByZoom)}),
				gp = new drawboard.graph.GraphProxy(gs,this.getDrawType());
			param && param.url && (gs.setUrl(param.url));
			param && param.ratio && (gs.setRatio(param.ratio));
			this.addCommand(drawboard.Constant.Command.CREATEVSDELETECOMMAND,this,gp);
		}
		this.drawEntity = null;
		this.graphStrategyParam = null;
	},
	/**
	 * get combine graph strategy class
	 */
	/*String*/getSRGraphStrategyClass:function(){
		return this.SRGraphStrategyClass;
	},
	/**
	 * set combine graph strategy class
	 */
	/*void*/setSRGraphStrategyClass:function(/*String*/SRGraphStrategyClass){
		this.SRGraphStrategyClass = SRGraphStrategyClass;
	},
	/**
	 * get select rectangle
	 */
	/*CompositeProxy*/getSelectRect:function(){
		return this._selectRect;
	},
	/**
	 * set select rectangle
	 */
	/*void*/setSelectRect:function(/*CompositeProxy*/selectRect){
		var preSelectRect = this._selectRect;
		if(selectRect == preSelectRect){
			return;
		}
		preSelectRect && preSelectRect.destroy();
		this._selectRect = selectRect;
	},
	/**
	 * whether or not contains the select rectangle
	 */
	/*boolean*/containsSelectRect:function(/*CompositeProxy*/selectRect){
		var exist = false;
		this.some(function(/*GraphProxy*/gp){
			if(gp.isComposite() && gp.equals(selectRect)){
				exist = true;
				return true;
			}
		},this);
		return exist;
	},
	/**
	 * combine multiple graphs
	 */
	/*void*/combine:function(){
		var selectRect = this.getSelectRect();
		selectRect && !this.containsSelectRect(selectRect) && !selectRect.resetRelations() && this.combineGraph(selectRect);
		this._selectRect = null;
	},
	/*void*/combineGraph:function(/*CompositGraphProxy*/gp){
		this.add(gp);
	},
	/**
	 * divide the composite graph to single
	 */
	/*void*/divide:function(){
		var gp = this.getActive();
		this.divideGraph(gp);
	},
	/*void*/divideGraph:function(/*GraphProxy*/gp){
		if(gp && gp.isComposite()){
			gp.destroy();
			this.remove(gp);
		}
	},
	/**
	 * add graph
	 */
	/*void*/addGraph:function(/*GraphStatus*/gs,/*String*/graphStrategyClass){
		var proxy = new drawboard.graph.GraphProxy(gs,graphStrategyClass);
		this.add(proxy);
	},
	/**
	 * remove graph
	 */
	/*void*/removeGraph:function(/*GraphProxy*/gp){
		gp.deleteAll(this,this.getRuntime());
		this.getRuntime().getContext().getStyleCtrl().removeGraph(gp);
		this.remove(gp);
	},
	/**
	 * get graph
	 */
	/*GraphProxy*/getGraph:function(/*String*/idty){
		var gs;
		this.some(function(/*GraphProxy*/item){
			if(item.getIdty() == idty){
				gs = item;
				return true;
			}
		});
		return gs;
	},
	/**
	 * zoom out or zoom in
	 * @param rate
	 */
	/*void*/zoom:function(/*{x:Double,y:Double}*/rate,/*ExecuteRuntime*/runtime){
		var preZoom = dojo.clone(runtime.getContext().getZoom());
		if(!runtime.getContext().setZoom(rate)){
			return;
		}
		//update the size of canvas
		var zoom = runtime.getContext().getZoom(),
			style = this.dbCanvas.style,
			gf = this.getGraphic(),
			w = this.w*zoom.x,
			h = this.h*zoom.y,
			domNode = this.domNode,
			geometry = common.calc.Geometry,
			selectRect = this.getSelectRect(),
			center;
		//update the canvas
		center = {x:domNode.scrollLeft + (this.w>>1),y:domNode.scrollTop + (this.h>>1)};
		center = geometry.dividePoint(center,preZoom)[0];
		center = geometry.multiPoint(center,zoom)[0];
		style.width = w + "px";
		style.height = h + "px";
		domNode.scrollLeft = center.x - (this.w>>1);
		domNode.scrollTop = center.y - (this.h>>1);
		gf.setSize(w,h);
		//update graphs
		this.forInItems(function(/*GraphProxy*/gp){
			gp && runtime.zoom(gp,zoom);
		},this,true);
		selectRect && runtime.zoom(selectRect,zoom);
		this.fireListener(["zoom",[rate]]);
	},
	/**
	 * draw graph
	 */
	/*void*/draw:function(){
		this.clearGraphs();
		var selectRect = this.getSelectRect(),
			drawEntity = this.getDrawEntity(),
			runtime = this.getRuntime();
		if(drawEntity){
			var gs = new drawboard.graph.GraphStatus({_coordinate:{x:drawEntity.x,y:drawEntity.y},_w:drawEntity.width,_h:drawEntity.height}),
				proxy = new drawboard.graph.GraphProxy(gs,this.getDrawType()||this.getSRGraphStrategyClass()),
				param = this.graphStrategyParam;
			param && param.url && (gs.setUrl(param.url));
			param && param.ratio && (gs.setRatio(param.ratio));
			proxy.showMark(false);
//			console.info("x:" + drawEntity.x + ",y:" + drawEntity.y + ",width:" + drawEntity.width + ",height:" + drawEntity.height);
			runtime.draw(proxy);
		}
		selectRect && (runtime.draw(selectRect));
		this.drawGraphs(runtime);
		this.fireListener(["draw"]);
	},
	/**
	 * draw graphs
	 * @param gf
	 */
	/*void*/drawGraphs:function(/*ExecuteRuntime*/runtime){
		this.forInItems(function(/*GraphProxy*/gp){
			gp && runtime.draw(gp);
		},this);
	},
	/**
	 * clear all graphs
	 */
	/*void*/clearGraphs:function(){
		this.getGraphic().clear();
	},
	/**
	 * set style for specific graph
	 * @param styleAttr
	 * @param style
	 */
	/*void*/setStyle:function(/*String*/styleAttr,/*String*/style,/*boolean*/isText){
		var gp = this.getActive();
		if(isText && gp && !gp.getText()){
			return;
		}
		gp && this.addCommand(drawboard.Constant.Command.STYLECOMMAND,this.getRuntime().getContext().getStyleCtrl(),{gp:gp,attr:styleAttr,value:style,isText:isText});
		this.clearCommand();
		this.draw();
	},
	/*void*/setText:function(/*String*/text){
		this.last().setText(text);
	},
	/************************************************************************************************************************
	 *										UNDO & REDO																		*
	 ************************************************************************************************************************/
	/*CommandController*/getCommandCtrl:function(){
		return this.getRuntime().getContext().getCommandCtrl();
	},
	/*void*/getCommands:function(){
		var commands = this._commands;
		if(!commands){
			commands = this._commands = new drawboard.command.CompositeCommand();
			this.getCommandCtrl().add(commands);
		}
		return commands;
	},
	/*void*/addCommand:function(/*Constant*/type,/*Object*/executor,/*Memo*/memo,/*boolean*/isNegative){
		var command = this.getCommandCtrl().instanceCommand(type,executor,memo,isNegative,this.getRuntime());
		command.execute();
		this.getCommands().add(command);
	},
	/*void*/clearCommand:function(){
		this._commands = null;
	},
	/*void*/undo:function(){
		this.getCommandCtrl().undo();
		this.draw();
	},
	/*void*/redo:function(){
		this.getCommandCtrl().redo();
		this.draw();
	}
});
