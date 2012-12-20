dojo.provide("drawboard.graph.strategy.polygon.OctagonStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.polygon.OctagonStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			h = gp.getHeight(runtime),
			w = gp.getWidth(runtime),
			x = start.x,
			y = start.y,
			h3 = h/3,
			w3 = w/3;
		return [
		        //first in the western of north size
		        {x:x + w3,y:y},
		        //two
		        {x:x + (w3<<1),y:y},
		        //three
		        {x:x + w,y:y + h3},
		        //four
		        {x:x + w,y:y + (h3<<1)},
		        //five
		        {x:x + (w3<<1),y:y + h},
		        //six
		        {x:x + w3,y:y + h},
		        //seven
		        {x:x,y:y + (h3<<1)},
		        //eight
		        {x:x,y:y + h3}
		        ];
	},
	
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
					//first in the western of north size
					{command:p.MOVE,points:cache[0]},
					//two
					{command:p.LINE,points:cache[1]},
					//three
					{command:p.LINE,points:cache[2]},
					//four
					{command:p.LINE,points:cache[3]},
					//five
					{command:p.LINE,points:cache[4]},
					//six
					{command:p.LINE,points:cache[5]},
					//seven
					{command:p.LINE,points:cache[6]},
					//eight
					{command:p.LINE,points:cache[7]}
		            ],this.getStyle(gp,runtime));
	}
});
})();