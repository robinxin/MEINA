dojo.provide("drawboard.graph.strategy.MotionCircleStrategy");
dojo.require("drawboard.controller.StyleController");
dojo.require("drawboard.graph.strategy.SquareStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.MotionCircleStrategy",drawboard.graph.strategy.SquareStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1;
		return geometry.isPointInCircle(point,{coordinate:gp.getGraphCoordinates(runtime)[0],r:r});
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1,
			cache = gp.getGraphCoordinates(runtime),
			motionAnchors = gp.getMotionAnchorCoordinates(runtime),
			a = geometry.angle(motionAnchors[0][0],cache[0],motionAnchors[1][0]),
			arc = [p.ARC + r,r,0,(a < 180?0:1) + ",1",motionAnchors[1][0].x + " " + motionAnchors[1][0].y];
		gf.drawPath([
					//first motion anchor
					{command:p.MOVE,points:motionAnchors[0][0]},
					arc.join(" ")
					],this.getStyle(gp,runtime),true);
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1,
			min = w > h?h:w,
			cache = [//circle center
				     {x:p.x + r,y:p.y + r}
				     ];
		gp.setWidth(min,runtime);
		gp.setHeight(min,runtime);
		return cache;
	},
	
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		//only have two motion anchors
		var motionAnchors = gp.getRealMotionAnchors(runtime),
			cache = [],gs,
			w = gp.getWidth(runtime),
			fixCoordinate = gp.getCoordinate(runtime),
			rotate = geometry.rotation,
			center = gp.getGraphCoordinates(runtime)[0];
		fixCoordinate.x += (w>>1);
		if(!motionAnchors){
			motionAnchors = [10,100];
			gs = gp.getGraphStatus();
			gs.setMotionAnchors(motionAnchors,runtime);
		}
		dojo.forEach(motionAnchors,function(anchor){
			cache.push(rotate(fixCoordinate,center,anchor));
		},this);
		return cache;
	},
	
	/**
	 * motion anchor arithmetic
	 */
	/*Object*/calcMotionAnchor:function(/*GraphProxy*/gp,/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1,
			fixCoordinate = gp.getCoordinate(runtime),
			cache = gp.getGraphCoordinates(runtime),
		    newp = geometry.intersectCircleLine(cache[0],r,cache[0],point)[0];
		fixCoordinate.x += (w>>1);
		return geometry.angle(fixCoordinate,cache[0],newp);
	}
});
})();