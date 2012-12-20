dojo.provide("drawboard.graph.strategy.DiamondStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.DiamondStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//in the middle of northern
					{command:p.MOVE,points:cache[0]},
					//in the middle of western
					{command:p.LINE,points:cache[1]},
					//in the middle of southern
					{command:p.LINE,points:cache[2]},
					//in the middle of eastern
					{command:p.LINE,points:cache[3]}
		            ],this.getStyle(gp,runtime));
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
		        //in the middle of northern
		        {x:x + (w>>1),y:y},
		        //in the middle of western
		        {x:x,y:y + (h>>1)},
		        //in the middle of southern
		        {x:x + (w>>1),y:y + h},
		        //in the middle of eastern
		        {x:x + w,y:y + (h>>1)}
		        ];
	}
});
})();