dojo.provide("drawboard._Selector");
dojo.require("drawboard.container.LayoutContainer");
dojo.require("drawboard.graph.CompositeProxy");
dojo.require("drawboard.graph.GraphStatus");
dojo.require("drawboard.Constant");
dojo.require("drawboard.drawProcessor.DrawProcessor");
(function(){
var constant = drawboard.Constant,
	actionStatus = constant.ActionStatus,
	mouseStatus = constant.MouseAction,
	geometry = common.calc.Geometry;
dojo.declare("drawboard._Selector",drawboard.container.LayoutContainer,{
	/*Array*/_events:null,										//store connect events
	/*Constant*/_status:actionStatus.NONE,						//current status when mouse down
	/*Constant*/_mouseStatus:mouseStatus.NONE,
	/*GraphProxy*/_active:null,									//current active graph proxy
	/*Decorate*/_decorate:null,									//current decorate,such as skeleton,mark,rotator
	/*String*/_graphStrategy:null,								//draw type
	/*boolean*/_isMark:false,									//active mark nodes or not
	/*boolean*/_isSelecting:false,								//active select operation
	/*double*/lastScrollTop:0,
	/*double*/lastScrollLeft:0,
	/*{active:GraphProxy,decorate:Decorate,status:Constant}*/cache:null,
	/*void*/postCreate:function(/*Node*/host){
		this._events = [dojo.connect(host,"onmousemove",dojo.hitch(this,"doMouseMove")),
		               dojo.connect(host,"onmousedown",dojo.hitch(this,"doMouseDown")),
		               dojo.connect(host,"onmouseup",dojo.hitch(this,"doMouseUp")),
		               dojo.connect(host,"onmouseover",dojo.hitch(this,"doMouseOver")),
		               dojo.connect(host,"onclick",dojo.hitch(this,"doClick")),
			  		   dojo.connect(host,"ondblclick",dojo.hitch(this,"doDblClick")),
		               dojo.connect(window,"onkeydown",dojo.hitch(this,"doKeyDown")),
			           dojo.connect(window,"onkeyup",dojo.hitch(this,"doKeyUp")),
		               dojo.connect(this.domNode,"onscroll",dojo.hitch(this,"doScroll"))];
		
	},
	/*void*/getStatusCache:function(){
		if(!this.cache){
			this.cache = {};
		}
		return this.cache;
	},
	
	/*void*/setStatusCache:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*Constant*/status){
		var cache = this.getStatusCache();
		gp && (cache.active = gp);
		decorate && (cache.decorate = decorate);
		cache.status = status;
	},
	
	/*void*/setStatus:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*Constant*/status){
		var active = this._active,parent;
		if(active && active != gp){
			parent = active.getParent && active.getParent();
			if(active.isComposite() && !active.contains(gp)){
				active.isFocus(false);
			}
			active.isActive(false);
			if(parent && !parent.contains(gp)){
				parent.isFocus(false);
				parent.isActive(false);
			}
		}
		this._active = gp;
		this._decorate = decorate;
		this._status = status;
		this.updateActive();
	},
	/*void*/updateActive:function(){
		var gp = this.getActive();
		gp && gp.isActive(true) && gp.isComposite() && gp.isFocus(true);
	},
	/**
	 * get status of current mouse status
	 */
	/*Constant*/getMouseStatus:function(){
		return this._mouseStatus;
	},
	/**
	 * set status of current mouse status
	 */
	/*void*/setMouseStatus:function(/*Constant*/status){
		this._mouseStatus = status;
	},
	/**
	 * get status of current action status
	 */
	/*Constant*/getActionStatus:function(){
		return this._status;
	},
	/**
	 * set status of current action status
	 */
	/*void*/setActionStatus:function(/*Constant*/status){
		this._status = status;
	},
	/**
	 * get decorate
	 */
	/*Decorate*/getDecorate:function(){
		return this._decorate;
	},
	/**
	 * set decorate
	 */
	/*void*/setDecorate:function(/*Decorate*/d){
		this._decorate = d;
	},
	/**
	 * get active
	 */
	/*GraphProxy*/getActive:function(){
		return this._active;
	},
	/**
	 * set active
	 */
	/*void*/setActive:function(/*GraphProxy*/gp){
		this._active = gp;
	},
	/**
	 * graph icon click
	 */
	/*void*/setDrawType:function(/*String*/graphStrategy){
		this._graphStrategy = graphStrategy;
		this._isSelecting = false;
		this._isMark = false;
	},
	/**
	 * get draw type
	 */
	/*String*/getDrawType:function(){
		return this._graphStrategy;
	},
	/**
	 * select icon click
	 */
	/*void*/isSelecting:function(/*boolean*/select){
		this._isSelecting = select;
		if(select){
			this._isMark = false;
			this._graphStrategy = null;
		}
	},
	/**
	 * mark icon click
	 */
	/*void*/isMark:function(/*boolean*/mark){
		this._isMark = mark;
		if(mark){
			this._isSelecting = false;
			this._graphStrategy = null;
		}
	},
	
	/******************************************************
	 * 			Event Action
	 *****************************************************/
	/*void*/doClick:function(e){
		this.setMouseStatus(mouseStatus.MOUSECLICK);
	},
	/*void*/doDblClick:function(e){
		var active = this.getActive(),
			text = active && active.getText(),	
			textBoard = this.getTextBoard();
		if(text){
			textBoard.setText(text);
			textBoard.show(active);
		}
	},
	/*void*/doMouseMove:function(e){
		if(this.getMouseStatus() == mouseStatus.MOUSEDOWN){
			var active = this.getActive(),
				cache = this.getStatusCache(),
				cacheActive = cache.active,
				parent = cacheActive && cacheActive.getParent && cacheActive.getParent(),
				relationCtrl = drawboard.relationController,
				decorate = this.getDecorate(),
				runtime = this.getRuntime();
			//active && relationCtrl.containRestrain(active,decorate,runtime) && this.addCommand(constant.Command.ADDVSDELTECONSTRAINCOMMAND,relationCtrl,{restrainedGp:active,restrainedD:decorate},false);
			//active && drawboard.relationController.removeListener(active,this.getDecorate(),this.getRuntime());
			if(cacheActive && cacheActive.isComposite() && active){
				!active.isActive(false) && active.isComposite() && active.isFocus(false);
				cacheActive.isActive(true);
				cacheActive.isFocus(true);
				parent && parent.isFocus(true);
				this._active = cacheActive;
			}
		}
		this.setMouseStatus(mouseStatus.MOUSEMOVE);
	},
	/*void*/doMouseDown:function(e){
		this.getTextBoard().hide();
		var d = drawboard,
			markController = d.markController,
			point = this.fetchCoordinate(e),
			active,
			runtime = this.getRuntime(),
			setActive = dojo.hitch(runtime.getDrawProcessor(),"setActive"),
			selectRect = this.getSelectRect(),
			preActive = this.getActive(),
			status = this._status;
		this.setMouseStatus(mouseStatus.MOUSEDOWN);
		if(status && status == actionStatus.TEXT){
			return;
		}
		//if draw type exist,then current status is drawing
		if(this._graphStrategy){
			this.setStatus(null, null, actionStatus.DRAWING);
			return;
		}
		selectRect && (active = setActive(selectRect,point,this._isMark,markController,runtime));
		//get the graph status information which contains the point
		if(!active){
			//first focus the active graph
			preActive && (active = setActive(preActive,point,this._isMark,markController,runtime));
			(!active) && this.some(function(/*GraphProxy*/gp){
				//if it is mark,then current status is marking
				active = setActive(gp,point,this._isMark,markController,runtime);
				if(active){
					return true;
				}
			},this,true);
		}
		//add select rectangle
		if(this.getActive() && e.ctrlKey && active && active.active){
			active = active.active;
			if(selectRect){
				if(selectRect.contains(active)){
					return;
				}
				selectRect.add(active,runtime);
			}else{
				var preActive = this.getActive();
				if(!preActive){
					return;
				}
				if(preActive.isComposite() && preActive.contains(active)){
					return;
				}
				var rect = geometry.getMaxRect([active.getGraphCoordinates(runtime).concat(preActive.getGraphCoordinates(runtime))]),
					selectRect = new drawboard.graph.CompositeProxy(new drawboard.graph.GraphStatus({_coordinate:{x:rect.x,y:rect.y},_w:rect.width,_h:rect.height}),this.getSRGraphStrategyClass());
				preActive.isActive(false);
				selectRect.add(preActive,runtime);
				selectRect.add(active,runtime);
				this.setSelectRect(selectRect);
				this.setStatus(selectRect, null, actionStatus.MOVING);
			}
			this.draw();
			return;
		}
		if(selectRect){
			if(!active){
				this.setSelectRect(null);
				this.draw();
				return;
			}
			this.setStatus(active.active, active.decorate, active.status);
			return;
		}
		//if the active is null,then the operation is selecting
		if(!active){
			this.setStatus(null, null, actionStatus.SELECTING);
		}else{
			this.setStatus(active.active, active.decorate, active.status);
		}
//		this.draw();
	},
	/*void*/doMouseOver:function(e){
		this.setMouseStatus(mouseStatus.MOUSEOVER);
	},
	/*void*/doMouseUp:function(e){
		this.setMouseStatus(mouseStatus.MOUSEUP);
		this.setStatusCache(this._active, this._decorate, this._status);
		this._status = actionStatus.NONE;
		this._decorate = null;
	},
	/*void*/doKeyDown:function(e){
		var gp = this.getActive(),
			selectRect = this.getSelectRect(),
			keys = dojo.keys,
			commandConstant = constant.Command,
			addCommand = dojo.hitch(this,"addCommand"),
			update = false;
		if(gp && e.keyCode == keys.DELETE && !e.ctrlKey){
			addCommand(commandConstant.CREATEVSDELETECOMMAND,this,gp,true);
			selectRect && this.setSelectRect(null);
			update = true;
		}
		//below is only for test
		if(e.keyCode == keys.UP_ARROW){
			addCommand(commandConstant.ZOOMCOMMAND,this,{x:10,y:10});
			update = true;
		}
		if(e.keyCode == keys.DOWN_ARROW){
			addCommand(commandConstant.ZOOMCOMMAND,this,{x:-10,y:-10});
			update = true;
		}
		if(e.keyCode == 90 && e.ctrlKey){
			this.undo();
			update = true;
		}
		if(e.keyCode == 89 && e.ctrlKey){
			this.redo();
			update = true;
		}
		update && this.draw();
	},
	/*void*/doKeyUp:function(e){
		this.clearCommand();
	},
	/*void*/doScroll:function(/*Event*/e){
		var target = e.target || e.srcElement;
		if(target != this.domNode){
			return;
		}
		var top = target.scrollTop,
			left = target.scrollLeft,
			lastTop = this.lastScrollTop,
			lastLeft = this.lastScrollLeft;
		if(top != lastTop){
			this.fireListener(["doScroll",[false,top - lastTop]]);
			this.lastScrollTop = top;
			return;
		}
		if(left != lastLeft){
			this.fireListener(["doScroll",[true,left - lastLeft]]);
			this.lastScrollLeft = left;
		}
	},
	/*void*/destroy:function(){
		dojo.forEach(this.events,dojo.disconnect);
	}
});
})();