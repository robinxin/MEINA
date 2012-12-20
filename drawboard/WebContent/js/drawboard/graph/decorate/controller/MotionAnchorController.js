dojo.provide("drawboard.graph.decorate.controller.MotionAnchorController");
dojo.require("drawboard.graph.decorate.controller.Controller");
dojo.require("drawboard.controller.StyleController");
dojo.require("drawboard.graph.decorate.MotionAnchor");
dojo.require("common.utils.CollectionUtils");
dojo.require("common.calc.Geometry");
(function(){
var	geometry = common.calc.Geometry,
	utils = common.utils.CollectionUtils;		
dojo.declare("drawboard.graph.decorate.controller.MotionAnchorController",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.MOTIONANCHOR,
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var maCoordinates,
			motionAnchor = new drawboard.graph.decorate.MotionAnchor(),
			gf = runtime.getGraphic(),
			motionAnchors = gp.getMotionAnchorCoordinates(runtime);
		motionAnchors && dojo.forEach(motionAnchors,function(item,index){
			maCoordinates = utils.sliceRange(item,1,4);
			motionAnchor.setCoordinate(maCoordinates);
			motionAnchor.setIndex(index),
			motionAnchor.draw(gf,this.getStyle(gp,motionAnchor,runtime),runtime);
		},this);
	},
	/**
	 * whether or not the coordinate is in the rectangle
	 */
	/*MotionAnchor*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		var motionAnchor,motionAnchors = gp.getMotionAnchorCoordinates(runtime),center;
		motionAnchors && dojo.some(motionAnchors,function(item,index){
			center = item[0];
			item = utils.sliceRange(item,1,4);
			if(geometry.isPointInPolyn(item,coordinate)){
				motionAnchor = new drawboard.graph.decorate.MotionAnchor({coordinate:item,index:index,center:center});
				return true;
			}
		},this);
		return motionAnchor;
	}
});
if(!drawboard.motionAnchorController){
	drawboard.motionAnchorController = new drawboard.graph.decorate.controller.MotionAnchorController();
}
})();