dojo.provide("drawboard.graph.decorate.Rotator");
dojo.require("drawboard.Constant");
dojo.require("drawboard.graph.decorate.Decorator");
(function(){
var constant = drawboard.Constant;
dojo.declare("drawboard.graph.decorate.Rotator",drawboard.graph.decorate.Decorator,{
	/*Constant*/_type:constant.Decorate.ROTATOR,
	/*CoordinateFormatter*/pole:null,
	/*Double*/angle:null,
	/**
	 * draw the rotator
	 */
	/*void*/draw:function(/*Graphic*/gf,/*String*/style,/*ExecuteRuntime*/runtime){
		var r = runtime.getDistance(),
			p = constant.Path,
			path = [],
			cache = this.getCoordinate();
		//draw pole circle
		gf.drawCircle(cache[3],r,style);
		gf.drawLine(cache[2],cache[1],style);
		gf.drawCircle({x:cache[0].x,y:cache[0].y - r},r,style);
	}
});
})();