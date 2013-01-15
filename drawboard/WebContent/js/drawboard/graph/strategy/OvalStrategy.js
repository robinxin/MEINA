dojo.provide("drawboard.graph.strategy.OvalStrategy");
dojo.require("drawboard.graph.strategy.RectangleStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.OvalStrategy",drawboard.graph.strategy.RectangleStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getOutletCoordinates(runtime),point);
	},
	
	/**
	 * draw graph only
	 */
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var cache = gp.getGraphCoordinates(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			p = constant.Path,
			path = [],
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		return gf.drawEllipse(gp.getCoordinate(runtime),w,h,(a != 0)&&{transform:transform},this.getStyle(gp,runtime));
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			cache = [//circle center
				     {x:p.x + w,y:p.y + h}];
		return cache;
	}
});
})();