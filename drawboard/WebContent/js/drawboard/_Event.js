dojo.provide("drawboard._Event");
dojo.require("drawboard.Constant");
dojo.require("drawboard.Constant");
dojo.require("common.calc.Geometry");
(function(){
var geometry = common.calc.Geometry,
	actionStatus = drawboard.Constant.ActionStatus,
	constant = drawboard.Constant;
dojo.declare("drawboard._Event",null,{
	/*CoordinateFormatter*/_start:null,		//the coordinate of mouse down or mouse move
	/*CoordinateFormatter*/_end:null,		//the coordinate of mouse move
	/*{left:Double,top:Double}*/boxCache:null,//current drawboard box coordinate
	/*Array<{gp:GraphProxy,d:Decorate,restrainedGp:GraphProxy,restrainedD:Decorate}>*/_marks:null,
											//mark which can be relative to,has the context
	/**
	 * get current drawboard panel box information
	 */
	/*void*/getBoxCache:function(){
		if(!this.boxCache){
			var node = (this.fixNode||this.domNode),
				cache = {left:node.offsetLeft,top:node.offsetTop};
			this.boxCache = cache;
		}
		return this.boxCache;
	},
	/**
	 * clear cache
	 */
	/*void*/refreshBoxCache:function(){
		this.boxCache = null;
	},
	/**
	 * get the coordinate of current mouse position in the drawboard panel
	 */
	/*CoordinateFormatter*/fetchCoordinate:function(/*Event*/e){
		var box = this.getBoxCache(),domNode = this.domNode;
		return {x:e.pageX - box.left + domNode.scrollLeft,y:e.pageY - box.top + domNode.scrollTop};
	},
	
	/*void*/showMarkActive:function(/*GraphProxy*/gp,/*Decorate*/d,/*ExecuteRuntime*/runtime){
		var activeAnchors = d || gp.getActiveAnchors(runtime),
			controller,marks,mark;
		if((d && !gp.isAnchor(d))||!activeAnchors){
			return;
		}
		(!dojo.isArray(activeAnchors))&&(activeAnchors = [activeAnchors]);
		controller = drawboard.markController;
		dojo.forEach(activeAnchors,function(/*Decorate<Skeleton>*/s){
			mark = controller.cross(s,gp,this,runtime);
			if(mark){
				!marks && (marks = []) && (this._marks = marks);
				marks.push(mark);
			}
		},this);
		controller = runtime.getContext().getStyleCtrl();
		!marks &&(this._marks = null); 
		if(marks){
			var actives = [];
			dojo.forEach(marks,function(m){
				this.push(m.d);
				gp = m.gp;
			},actives);
			controller.setActives(actives,gp);
			return;
		}
		controller.setActives(null);
	},
	
	/******************************************************
	 * 			Event Action
	 *****************************************************/
	/*void*/doClick:function(e){
		this.inherited(arguments);
	},
	/*void*/doMouseMove:function(e){
		this.inherited(arguments);
		this._end && (this._start = this._end);
		this._end = this.fetchCoordinate(e);
		var gp = this.getActive(),
			start = this._start,
			end = this._end,
			status = this.getActionStatus(),
			decorator = this.getDecorate(),rotator,pole,a,
			runtime = this.getRuntime(),
			selectRect = this.getSelectRect(),
			commandConstant = constant.Command,
			addCommand = dojo.hitch(this,this.addCommand),
			update = true;
		if(status != actionStatus.NONE && gp){
			rotator = dojo.clone(gp.getRotator(runtime));
			pole = rotator.coordinate;
		}
		selectRect && !gp && (gp = selectRect);
		if(!gp && status != actionStatus.DRAWING && status != actionStatus.SELECTING && status != actionStatus.TEXT){
			return;
		}
		switch(status){
			case actionStatus.RESIZING:
				addCommand(commandConstant.RESIZECOMMAND,gp,{decorate:decorator,start:start,end:end});
				//gp.sizeChange(decorator,start,end,runtime);
				this.showMarkActive(gp,drawboard.skeletonController.createItem(gp.getSkeletonCoordinates(runtime)[decorator.getIndex()],decorator.getIndex()),runtime);
				break;
			case actionStatus.MOVING:
				addCommand(commandConstant.MOVECOMMAND,gp,{start:start,end:end});
				//gp.move(start,end,runtime);
				this.showMarkActive(gp,null,runtime);
				break;
			case actionStatus.DRAWING:
			case actionStatus.SELECTING:
			case actionStatus.TEXT:
				var entity = this.getDrawEntity(true);
				entity.width = end.x - entity.x;
				entity.height = end.y - entity.y;
				break;
			case actionStatus.MOTION:
				addCommand(commandConstant.MOTIONCOMMAND,gp,{decorator:decorator,p:end});
				//gp.moveMotionAnchor(decorator,end,runtime);
				break;
			case actionStatus.ROTATING:
			case actionStatus.POLEMOVING:
				if(status == actionStatus.ROTATING){
					rotator.angle = geometry.angle({x:pole.x,y:pole.y - runtime.getContext().getParamsCtrl().getRotateDistance()},pole,this._end);
					addCommand(commandConstant.ROTATECOMMAND,gp,rotator);
					//gp.setRotator(rotator,runtime);
				}else{
					decorator.pole = rotator.coordinate = end;
					gp.setRotator(rotator,runtime);
				}
				break;
			case actionStatus.NONE:
			default:
				update = false;
				break;
		}
		update && this.draw();
	},
	/*void*/doMouseDown:function(e){
		this.inherited(arguments);
		var start = this.fetchCoordinate(e),
			status = this.getActionStatus(),
			entity;
		if(status == actionStatus.DRAWING || status == actionStatus.SELECTING || status == actionStatus.TEXT){
			entity = this.getDrawEntity(true);
			entity.x = start.x;
			entity.y = start.y;
		}
		this._start = start;
	},
	/*void*/doMouseOver:function(e){
		this.inherited(arguments);
	},
	/*void*/doMouseUp:function(e){
		var marks = this._marks,
			runtime = this.getRuntime(),
			astatus = this.getActionStatus(),
			isSelect = (astatus == actionStatus.DRAWING || astatus == actionStatus.TEXT)?false:true,
			relationCtrl = drawboard.relationController,
			gp = this.getActive(),
			decorator = this.getDecorate();
		gp && (gp.normalize(decorator,runtime));
		if(gp && relationCtrl.containRestrain(gp,decorator,runtime)){
			this.addCommand(constant.Command.ADDVSDELTECONSTRAINCOMMAND,relationCtrl,[{restrainedGp:gp,restrainedD:decorator}],true);
		}
		if(marks){
			var temps = [];
			dojo.forEach(marks,function(mark){
				if(!relationCtrl.containRestrain(mark.restrainedGp,mark.restrainedD,runtime)){
					temps.push(mark);
				}
			},this);
			(temps.length > 0) && this.addCommand(constant.Command.ADDVSDELTECONSTRAINCOMMAND,relationCtrl,temps);
		}
		if(this._status == actionStatus.TEXT){
			var entity = this.getDrawEntity(),
				textBoard = this.getTextBoard();
			textBoard.clearText();
			textBoard.show(entity);
			this.setDrawType("drawboard.graph.strategy.TextStrategy");
		}
		runtime.getContext().getStyleCtrl().setActives(null);
		this._start = null;
		this._end = null;
		this._marks = null;
		this.clearDrawEntity(isSelect);
		this.inherited(arguments);
		this.clearCommand();
		this.draw();
		dojo.publish("/drawboard/mouseup");
	}
});
})();