dojo.provide("drawboard.graph.strategy.RatioStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RatioStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		//must be override by subclass
	},
	/**
	 * draw graph only
	 */
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		//must be override by subclass
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var ratio = gp.getRatio(),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),temp;
		if(!ratio){
			return this._getGraphCoordinates(gp,runtime,w,h);
		}
		temp = h*ratio;
		if(temp > w){
			h = w/ratio;
		}else{
			w = temp;
		}
		gp.setWidth(w,runtime);
		gp.setHeight(h,runtime);
		return this._getGraphCoordinates(gp,runtime,w,h);
	},
	/*Array<DecorateCoordinateFormatter>*/_getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime,/*Double*/w,/*Double*/h){
		//must be override by subclass
	},
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			ratio = gp.getRatio(),
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			direct = decorate.getDirect(),
			temp;
		if(ratio){
			temp = h*ratio;
			if(temp > w){
				h = w/ratio;
			}else{
				w = temp;
			}
		}
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x + (delta>>1),y:p.y + (delta)},runtime);
				gp.setWidth(w - (delta),runtime);
				gp.setHeight(h - (delta),runtime);
				break;
			case d.WESTNORTH:
				delta = Math.abs(delta.x) > Math.abs(delta.y)?delta.y:delta.x,
				gp.setCoordinate({x:p.x + delta,y:p.y + delta},runtime);
				gp.setWidth(w - delta,runtime);
				gp.setHeight(h - delta,runtime);
				break;
			case d.EASTNORTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x,y:p.y + delta},runtime);
				gp.setWidth(w - delta,runtime);
				gp.setHeight(h - delta,runtime);
				break;
			case d.SOUTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x - (delta>>1),y:p.y},runtime);
				gp.setWidth(w + (delta),runtime);
				gp.setHeight(h + (delta),runtime);
				break;
			case d.EASTSOUTH:
				delta = Math.abs(delta.x) > Math.abs(delta.y)?delta.y:delta.x,
				gp.setCoordinate({x:p.x,y:p.y},runtime);
				gp.setWidth(w + delta,runtime);
				gp.setHeight(h + delta,runtime);
				break;
			case d.WESTSOUTH:
				delta = delta.x;
				gp.setCoordinate({x:p.x + delta,y:p.y},runtime);
				gp.setWidth(w - delta,runtime);
				gp.setHeight(h - delta,runtime);
				break;
			case d.WEST:
				delta = delta.x;
				gp.setCoordinate({x:p.x + delta,y:p.y + (delta>>1)},runtime);
				gp.setWidth(w - (delta),runtime);
				gp.setHeight(h - (delta),runtime);
				break;
			case d.EAST:
				delta = delta.x;
				gp.setCoordinate({x:p.x,y:p.y - (delta>>1)},runtime);
				gp.setWidth(w + (delta),runtime);
				gp.setHeight(h + (delta),runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
	}
});
})();