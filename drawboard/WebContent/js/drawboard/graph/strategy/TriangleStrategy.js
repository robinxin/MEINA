dojo.provide("drawboard.graph.strategy.TriangleStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.TriangleStrategy",drawboard.graph.strategy.GraphStrategy,{
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
					//north corner
					{command:p.MOVE,points:cache[0]},
					//east south corner
					{command:p.LINE,points:cache[1]},
					//west south corner
					{command:p.LINE,points:cache[2]}
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
		        //north corner
		        {x:x + (w>>1),y:y},
		        //east south corner
		        {x:x,y:y + h},
		        //west south corner
		        {x:x + w,y:y + h}
		        ];
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
		    		//south west
		    		{x:x,y:y + h},
		    		//south east
		    		{x:x + w,y:y + h},
		    		//center
		    		{x:x + (w>>1),y:y + (h>>1)}
			        ];
		}
		var marksList = [
							//north middle
							marks[0] || {x:x + (w>>1),y:y},
							//south west
							marks[1] || {x:x,y:y + h},
							//south east
							marks[2] || {x:x + w,y:y},
							//center
							marks[3] || {x:x + (w>>1),y:y + (h>>1)}
		                 ];
		for(var i = 4;i < marks.length;i++){
			marksList.push(marks[i]);
		}
		return marksList;
	}
});
})();