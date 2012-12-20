dojo.provide("drawboard.graph.strategy.GraphStrategy");
dojo.require("common.calc.Geometry");
dojo.require("drawboard.Constant");
dojo.require("common.exception.Exception");
(function(){
var	constant = drawboard.Constant;
/*
 * DecorateCoordinateFormatter extends CoordinateFormatter{
 * 		css:String
 * }
 */
dojo.declare("drawboard.graph.strategy.GraphStrategy",null,{
	/*Constant*/type:constant.Decorate.Graph,
	/*boolean*/_hasRotator:true,
	/**
	 * whether or not the rotator is shown 
	 */
	/*boolean*/hasRotator:function(){
		return this._hasRotator;
	},
	/**
	 * only use when rotator is not shown for ever.
	 */
	/*CoordinateFormatter*/getRotatorCoordinate:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	},
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	},
	/*boolean*/isAnchor:function(/*Decorate*/d){
		return false;
	},
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * draw graph content on shown
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	/**
	 * this function will be called in case of mouse up event call
	 * if return true,then clear cache,otherwise not do it.
	 */
	/*boolean*/normalize:function(/*GraphProxy*/gp,/*Decorator*/decorator,/*ExecuteRuntime*/runtime){
		//override by subclass
		return false;
	},
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			deltaX = delta.x,
			deltaY = delta.y,
			direct = decorate.getDirect();
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				gp.setCoordinate({x:p.x,y:p.y + deltaY},runtime);
				gp.setHeight(h - deltaY,runtime);
				break;
			case d.SOUTH:
				gp.setHeight(h + deltaY,runtime);
				break;
			case d.WEST:
				gp.setCoordinate({x:p.x + deltaX,y:p.y},runtime);
				gp.setWidth(w - deltaX,runtime);
				break;
			case d.EAST:
				gp.setWidth(w + deltaX,runtime);
				break;
			case d.WESTNORTH:
				gp.setCoordinate({x:p.x + deltaX,y:p.y + deltaY},runtime);
				gp.setWidth(w - deltaX,runtime);
				gp.setHeight(h - deltaY,runtime);
				break;
			case d.EASTNORTH:
				gp.setCoordinate({x:p.x,y:p.y + deltaY},runtime);
				gp.setWidth(w + deltaX,runtime);
				gp.setHeight(h - deltaY,runtime);
				break;
			case d.EASTSOUTH:
				gp.setWidth(w + deltaX,runtime);
				gp.setHeight(h + deltaY,runtime);
				break;
			case d.WESTSOUTH:
				gp.setCoordinate({x:p.x + deltaX,y:p.y},runtime);
				gp.setWidth(w - deltaX,runtime);
				gp.setHeight(h + deltaY,runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
		this._sizeChange(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime);
	},
	/**
	 * reset the graph size
	 */
	/*void*/_sizeChange:function(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw"},
		    		//east north corner
		    		{x:x + w,y:y,css:"mover_ne"},
		    		//west south corner
		    		{x:x,y:y + h,css:"mover_sw"},
		    		//east south corner
		    		{x:x + w,y:y + h,css:"mover_se"},
		    		//north middle
		    		{x:x + (w>>1),y:y,css:"mover_n"},
		    		//south middle
		    		{x:x + (w>>1),y:y + h,css:"mover_s"},
		    		//west middle
		    		{x:x,y:y + (h>>1),css:"mover_w"},
		    		//east middle
		    		{x:x + w,y:y + (h>>1),css:"mover_e"}	        	
		        ];
	},
	
	/**
	 * motion anchor arithmetic
	 */
	/*CoordinateFormatter*/calcMotionAnchor:function(/*GraphProxy*/gp,/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * fetch the marks' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			marks = gp.getRealMarks(runtime),
			x = start.x,
			y = start.y;
		if(!marks){
			return [
			    	//north middle
		    		{x:x + (w>>1),y:y},
		    		//south middle
		    		{x:x + (w>>1),y:y + h},
		    		//west middle
		    		{x:x,y:y + (h>>1)},
		    		//east middle
		    		{x:x + w,y:y + (h>>1)}
			        ];
		}
		var marksList = [
							//north middle
							marks[0] || {x:x + (w>>1),y:y},
							//south middle
							marks[1] || {x:x + (w>>1),y:y + h},
							//west middle
							marks[2] || {x:x,y:y + (h>>1)},
							//east middle
							marks[3] || {x:x + w,y:y + (h>>1)}
		                 ];
		for(var i = 4;i < marks.length;i++){
			marksList.push(marks[i]);
		}
		return marksList;
	},
	/*StyleController*/getStyleController:function(/*ExecuteRuntime*/runtime){
		return runtime.getContext().getStyleCtrl();
	},
	/*String*/getStyle:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return this.getStyleController(runtime).getStyle(this.type,gp);
	}
});
})();