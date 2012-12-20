dojo.provide("drawboard.graph.decorate.controller.MarkController");
dojo.require("drawboard.graph.decorate.controller.Controller");
dojo.require("drawboard.graph.decorate.Mark");
dojo.require("drawboard.Constant");
dojo.require("common.calc.Geometry");
(function(){
var	geometry = common.calc.Geometry;	
dojo.declare("drawboard.graph.decorate.controller.MarkController",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.MARK,
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var mCoordinate,
			mark = new drawboard.graph.decorate.Mark(),
			gf = runtime.getGraphic();
		dojo.forEach(gp.getMarkCoordinates(runtime)||[],function(item,index){
			mCoordinate = [item[1],item[3],item[2],item[4]];
			mark.setCoordinate(mCoordinate);
			mark.setIndex(index);
			mark.draw(gf,this.getStyle(gp,mark,runtime),runtime);
		},this);
	},
	
	/**
	 * whether or not the coordinate is in the rectangle
	 */
	/*Mark*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		var mark;
		dojo.some(gp.getMarkCoordinates(runtime)||[],function(item,index){
			item = [item[1],item[3],item[2],item[4]];
			if(geometry.isPointInPolyn(item,coordinate)){
				mark = new drawboard.graph.decorate.Mark({coordinate:item,index:index,center:item[0]});
				return true;
			}
		},this);
		return mark;
	},
	
	/**
	 * create decorate by coordinates
	 */
	/*Array<Decorate<Mark>>*/create:function(/*Array<Array<CoordinateFormatter>>*/ps){
		var mark,marks = [];
		dojo.forEach(ps||[],function(item,index){
			mark = [item[1],item[3],item[2],item[4]];
			mark = new drawboard.graph.decorate.Mark({coordinate:skeleton,index:index});
			marks.push(mark);
		},this);
		return marks;
	},
	
	/**
	 * whether or not the mark and skeleton cross
	 */
	/*{gp:GraphProxy,d:Decorate,restrainedGp:GraphProxy,restrainedD:Decorate}*/cross:function(/*Decorate<Skeleton>*/s,/*GraphProxy*/cgp,/*DrawBoard*/db,/*ExecuteRuntime*/runtime){
		var marks,skeletonController = drawboard.skeletonController,mark,result = {};
		db.some(function(/*GraphProxy*/gp){
			if(gp == cgp){
				return false;
			}
			marks = gp.getMarkCoordinates(runtime);
			dojo.some(marks||[],function(item,index){
				item = [item[1],item[3],item[2],item[4]];
				dojo.some(item,function(/*CoordinateFormatter*/p){
					if(skeletonController.isIn(s.getCoordinate(),p,runtime)){
						mark = true;
						return true;
					}
				},this);
				if(mark){
					result.d = new drawboard.graph.decorate.Mark({coordinate:item,index:index});
					return true;
				}
			},this);
			if(mark){
				result.gp = gp;
				return true;
			}
		},this,true);
		if(mark){
			result.restrainedGp = cgp;
			result.restrainedD = s;
			return result;
		}
		return null;
	}
});
if(!drawboard.markController){
	drawboard.markController = new drawboard.graph.decorate.controller.MarkController();
}
})();