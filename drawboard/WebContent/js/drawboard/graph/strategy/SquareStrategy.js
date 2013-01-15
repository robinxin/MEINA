dojo.provide("drawboard.graph.strategy.SquareStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.SquareStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/**
	 * draw graph only
	 */
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		return gf.drawPath([
					//west north corner
					{command:p.MOVE,points:cache[0]},
					//east north corner
					{command:p.LINE,points:cache[1]},
					//east south corner
					{command:p.LINE,points:cache[2]},
					//west south corner
					{command:p.LINE,points:cache[3]},
					{command:p.LINE,points:cache[0]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			min = w > h?h:w,
			x = start.x,
			y = start.y;
		gp.setWidth(min,runtime);
		gp.setHeight(min,runtime);
		return [
		        //west north corner
		        {x:x,y:y},
		        //east north corner
		        {x:x + min,y:y},
		        //east south corner
		        {x:x + min,y:y + min},
		        //west south corner
		        {x:x,y:y + min}
		        ];
	},
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			min = w > h?h:w,
			direct = decorate.getDirect();
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x + (delta>>1),y:p.y + (delta)},runtime);
				gp.setWidth(min - (delta),runtime);
				gp.setHeight(min - (delta),runtime);
				break;
			case d.WESTNORTH:
				delta = Math.abs(delta.x) > Math.abs(delta.y)?delta.y:delta.x,
				gp.setCoordinate({x:p.x + delta,y:p.y + delta},runtime);
				gp.setWidth(min - delta,runtime);
				gp.setHeight(min - delta,runtime);
				break;
			case d.EASTNORTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x,y:p.y + delta},runtime);
				gp.setWidth(min - delta,runtime);
				gp.setHeight(min - delta,runtime);
				break;
			case d.SOUTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x - (delta>>1),y:p.y},runtime);
				gp.setWidth(min + (delta),runtime);
				gp.setHeight(min + (delta),runtime);
				break;
			case d.EASTSOUTH:
				delta = Math.abs(delta.x) > Math.abs(delta.y)?delta.y:delta.x,
				gp.setCoordinate({x:p.x,y:p.y},runtime);
				gp.setWidth(min + delta,runtime);
				gp.setHeight(min + delta,runtime);
				break;
			case d.WESTSOUTH:
				delta = delta.x;
				gp.setCoordinate({x:p.x + delta,y:p.y},runtime);
				gp.setWidth(min - delta,runtime);
				gp.setHeight(min - delta,runtime);
				break;
			case d.WEST:
				delta = delta.x;
				gp.setCoordinate({x:p.x + delta,y:p.y + (delta>>1)},runtime);
				gp.setWidth(min - (delta),runtime);
				gp.setHeight(min - (delta),runtime);
				break;
			case d.EAST:
				delta = delta.x;
				gp.setCoordinate({x:p.x,y:p.y - (delta>>1)},runtime);
				gp.setWidth(min + (delta),runtime);
				gp.setHeight(min + (delta),runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
	}
});
})();