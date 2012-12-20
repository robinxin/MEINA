dojo.provide("drawboard.graph.strategy.electricity.VariableResistanceStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.electricity.VariableResistanceStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var ps = gp.getGraphCoordinates(runtime);
		if(geometry.isPointInSegment(ps[0],ps[1],point) 
			|| geometry.isPointInPolyn([ps[2],ps[3],ps[4],ps[5]],point)
			|| geometry.isPointInSegment(ps[6],ps[7],point)
			|| geometry.isPointInSegment(ps[8],ps[9],point)
			|| geometry.isPointInSegment(ps[10],ps[11],point)){
			return true;
		}
		return false;
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//west side start line
					{command:p.MOVE,points:cache[0]},
					//west side end line
					{command:p.LINE,points:cache[1]},
					//west north corner
					{command:p.MOVE,points:cache[2]},
					//west south corner
					{command:p.LINE,points:cache[3]},
					//east south corner
					{command:p.LINE,points:cache[4]},
					//east north corner
					{command:p.LINE,points:cache[5]},
					{command:p.LINE,points:cache[2]},
					//east side end line
					{command:p.MOVE,points:cache[6]},
					//east side start line
					{command:p.LINE,points:cache[7]},
					//top
					{command:p.MOVE,points:cache[8]},
					{command:p.LINE,points:cache[9]},
					{command:p.MOVE,points:cache[10]},
					{command:p.LINE,points:cache[11]}
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
			y = start.y,
			uw = w>>3,
			uh = h>>3;
		return [
					//west side start line
					{x:x,y:y + (h>>1)},
					//west side end line
					{x:x + uw,y:y + (h>>1)},
					//west north corner
					{x:x + uw,y:y + uh},
					//west south corner
					{x:x + uw,y:y + h - uh},
					//east south corner
					{x:x + w - uw,y:y + h - uh},
					//east north corner
					{x:x + w - uw,y:y + uh},
					//east side end line
					{x:x + w - uw,y:y + (h>>1)},
					//east side start line
					{x:x + w,y:y + (h>>1)},
					//top
					{x:x + (w>>1),y:y},
					{x:x + (w>>1),y:y + (uh>>1)},
					{x:x + (w>>1) - (uw>>1),y:y + (uh>>1)},
					{x:x + (w>>1) + (uw>>1),y:y + (uh>>1)}
		        ];
	}
});
})();