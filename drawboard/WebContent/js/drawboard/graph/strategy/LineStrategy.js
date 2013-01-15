dojo.provide("drawboard.graph.strategy.LineStrategy");
dojo.require("drawboard.controller.StyleController");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.LineStrategy",drawboard.graph.strategy.GraphStrategy,{
	/*boolean*/_hasRotator:false,
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var cache = gp.getGraphCoordinates(runtime);
		return geometry.isPointInSegment(cache[0],cache[1],point);
	},
	
	/*boolean*/isAnchor:function(/*Decorate*/d){
		return true;
	},
	
	/**
	 * draw graph only
	 */
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		return gf.drawLine(cache[0],cache[1],this.getStyle(gp,runtime));
	},
	
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return drawboard.skeletonController.create(gp.getSkeletonCoordinates(runtime));
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
		    		//east south corner
		    		{x:x + w,y:y + h,css:"mover_se"}
		        ];
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw",isAnchored:true},
		    		//east south corner
		    		{x:x + w,y:y + h,css:"mover_se",isAnchored:true}
		        ];
	},
	
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	},

	/**
	 * fetch the marks' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	}
});
})();