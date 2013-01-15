dojo.provide("drawboard.graph.strategy.CircleStrategy");
dojo.require("drawboard.controller.StyleController");
dojo.require("drawboard.graph.strategy.SquareStrategy");
(function(){
var	geometry = common.calc.Geometry;
dojo.declare("drawboard.graph.strategy.CircleStrategy",drawboard.graph.strategy.SquareStrategy,{
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
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var cache = gp.getGraphCoordinates(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1;
		return gf.drawCircle(cache[0],r,this.getStyle(gp,runtime));
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			min = w > h?h:w,
			r = min>>1,
			cache = [//circle center
				     {x:p.x + r,y:p.y + r}];
		gp.setWidth(min,runtime);
		gp.setHeight(min,runtime);	
		return cache;
	}
});
})();