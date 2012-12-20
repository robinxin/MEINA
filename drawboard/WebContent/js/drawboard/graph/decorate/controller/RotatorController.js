dojo.provide("drawboard.graph.decorate.controller.RotatorController");
dojo.require("drawboard.graph.decorate.controller.Controller");
dojo.require("drawboard.graph.decorate.Rotator");
dojo.require("common.calc.Geometry");
(function(){
var	geometry = common.calc.Geometry;
dojo.declare("drawboard.graph.decorate.controller.RotatorController",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.ROTATOR,
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		if(!gp.hasRotator()){
			return;
		}
		var coordinates = gp.getRotatorCoordinates(runtime),rotator;
		rotator = gp.getRotator(runtime);
		rotator = new drawboard.graph.decorate.Rotator({pole:rotator.coordinate,angle:rotator.angle,coordinate:coordinates});
		rotator.draw(runtime.getGraphic(),this.getStyle(gp,rotator,runtime),runtime);
	},
	/**
	 * whether or not the coordinate is in the rectangle
	 */
	/*Rotator*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		if(!gp.hasRotator()){
			return null;
		}
		var rotator;
		if(this.isIn(gp,coordinate,runtime)){
			rotator = gp.getRotator(runtime);
			rotator = new drawboard.graph.decorate.Rotator({coordinate:gp.getRotatorCoordinates(runtime),pole:rotator.pole,angle:rotator.angle});
		}
		return rotator;
	},
	/**
	 * whether or not the coordinate is in the circle
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		if(!gp.hasRotator()){
			return false;
		}
		var r = runtime.getDistance(),
			cache = gp.getRotatorCoordinates(runtime);
		if(geometry.isPointInCircle(coordinate,{coordinate:cache[3],r:r}) || 
				geometry.isPointInCircle(coordinate,{coordinate:cache[5],r:r}) ||
				geometry.isPointInSegment(cache[1],cache[4],coordinate)){
			return true;
		}
		return false;
	},
	/**
	 * whether or not the coordinate is in the pole circle
	 */
	/*boolean*/isInPole:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		if(!gp.hasRotator()){
			return false;
		}
		var caceh = gp.getRotatorCoordinates(runtime);
		if(geometry.isPointInCircle(coordinate,{coordinate:caceh[3],r:runtime.getDistance()})){
			return true;
		}
		return false;
	}
});
if(!drawboard.rotatorController){
	drawboard.rotatorController = new drawboard.graph.decorate.controller.RotatorController();
}
})();