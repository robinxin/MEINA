dojo.provide("drawboard.graph.decorate.controller.SkeletonController");
dojo.require("drawboard.graph.decorate.controller.Controller");
dojo.require("drawboard.graph.decorate.Skeleton");
dojo.require("common.utils.CollectionUtils");
dojo.require("common.calc.Geometry");
(function(){
var	geometry = common.calc.Geometry,
	utils = common.utils.CollectionUtils;	
dojo.declare("drawboard.graph.decorate.controller.SkeletonContainer",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.SKELETON,
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var sCoordinate,
			skeleton = new drawboard.graph.decorate.Skeleton(),
			gf = runtime.getGraphic();
		dojo.forEach(gp.getSkeletonCoordinates(runtime)||[],function(item,index){
			sCoordinate = utils.sliceRange(item,1,4);
			skeleton.setCoordinate(sCoordinate);
			skeleton.setIndex(index);
			item[0].isAnchored && skeleton.anchored(item[0].isAnchored);
			skeleton.draw(gf,this.getStyle(gp,skeleton,runtime),runtime);
		},this);
	},
	/*boolean*/isIn:function(/*Array<CoordinateFormatter>*/ps,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(ps,coordinate);
	},
	/**
	 * whether or not the coordinate is in the rectangle
	 */
	/*Skeleton*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		var skeleton,gs = gp.getGraphStrategy(),temp,center;
		dojo.some(gp.getSkeletonCoordinates(runtime)||[],function(item,index){
			center = item[0];
			temp = utils.sliceRange(item,1,4);
			if(this.isIn(temp, coordinate,runtime)){
				skeleton = new drawboard.graph.decorate.Skeleton({coordinate:temp,index:index,_direct:item[0].css,center:center});
				gs.isAnchor(skeleton) && skeleton.anchored(true);
				return true;
			}
		},this);
		return skeleton;
	},
	/**
	 * create decorate by coordinates
	 */
	/*Array<Decorate<Skeleton>>*/create:function(/*Array<Array<CoordinateFormatter>>*/ps){
		var skeletons = [];
		dojo.forEach(ps||[],function(item,index){
			skeletons.push(this.createItem(item, index));
		},this);
		return skeletons;
	},
	/*Decorate<Skeleton>*/createItem:function(/*Array<CoordinateFormatter>*/ps,/*Integer*/index){
		var skeleton = new drawboard.graph.decorate.Skeleton({coordinate:utils.sliceRange(ps,1,4),index:index,_direct:ps[0].css});
		ps[0].isAnchored && skeleton.anchored(true);
		return skeleton;
	}
});
if(!drawboard.skeletonController){
	drawboard.skeletonController = new drawboard.graph.decorate.controller.SkeletonContainer(); 
}
})();