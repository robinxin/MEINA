//no implements
dojo.provide("drawboard.graph.strategy.arrow.FancyArrowStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.arrow.FancyArrowStrategy",drawboard.graph.strategy.GraphStrategy,{
	/*boolean*/_hasRotator:false,
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/*boolean*/isAnchor:function(/*Decorate*/d){
		if(d.getIndex() == 2){
			return true;
		}
		return false;
	},
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var skeletons = gp.getSkeletonCoordinates(runtime),actives = [skeletons[2]];
		return drawboard.skeletonController.create(actives);
	},
	/**
	 * only use when rotator is not shown for ever.
	 */
	/*CoordinateFormatter*/getRotatorCoordinate:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return this.getGraphCoordinates(gp,runtime)[0];
	},
	/**
	 * draw graph only
	 */
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		return gf.drawPath([
					//array header
					{command:p.MOVE,points:cache[0]},
					//on the left size of array header
					{command:p.LINE,points:cache[1]},
					{command:p.LINE,points:cache[2]},
					{command:p.LINE,points:cache[3]},
					//on the right size of array header
					{command:p.LINE,points:cache[4]},
					{command:p.LINE,points:cache[5]},
					{command:p.LINE,points:cache[6]}
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
			h3 = h/3;
		return [
		        //array header
		        {x:x,y:y + (h>>1),isAnchored:true},
		        //on the left size of array header
		        {x:x + (h>>1),y:y},
		        {x:x + (h>>1),y:y + h3},
		        {x:x + w,y:y + h3},
		        //on the right size of array header
		        {x:x + w,y:y + (h3<<1)},
		        {x:x + (h>>1),y:y + (h3<<1)},
		        {x:x + (h>>1),y:y + h}
		        ];
	},
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		    		//north middle
		    		{x:x + (w>>1),y:y,css:"mover_n"},
		    		//south middle
		    		{x:x + (w>>1),y:y + h,css:"mover_s"},
		    		//west middle
		    		{x:x,y:y + (h>>1),css:"mover_w"}
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
			deltaX = delta.x,
			deltaY = delta.y,
			direct = decorate.getDirect();
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				gp.setCoordinate({x:p.x,y:p.y + (deltaY)},runtime);
				gp.setHeight(h - (deltaY<<1),runtime);
				break;
			case d.SOUTH:
				gp.setCoordinate({x:p.x,y:p.y - (deltaY)},runtime);
				gp.setHeight(h + (deltaY<<1),runtime);
				break;
			case d.WEST:
				var preEm = gp.getMotionAnchorCoordinates(runtime)[0][0],
					start,wm,em,
					rotator = gp.getRotator(runtime);
				gp.setCoordinate({x:p.x + deltaX,y:p.y + deltaY},runtime);
				start = gp.getCoordinate(runtime);
				wm = {x:start.x,y:start.y + (h>>1)};				//west middle coordinate
				em = {x:start.x + w,y:start.y + (h>>1)};
				rotator.angle = geometry.angle(em,wm,preEm);
				gp.setWidth(geometry.getDistant(preEm,wm),runtime);
				gp.setRotator(rotator,runtime);
				break;
			case d.EAST:
				var preEm = gp.getSkeletonCoordinates(runtime)[3][0],
					start =  gp.getCoordinate(runtime),
					wm,em,curEm,
					rotator = gp.getRotator(runtime);
				wm = {x:start.x,y:start.y + (h>>1)};				//west middle coordinate
				em = {x:start.x + w,y:start.y + (h>>1)};
				curEm = {x:preEm.x + deltaX,y:preEm.y + deltaY};
				rotator.angle = geometry.angle(em,wm,curEm);
				gp.setWidth(geometry.getDistant(curEm,wm),runtime);
				gp.setRotator(rotator,runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
	}
});
})();