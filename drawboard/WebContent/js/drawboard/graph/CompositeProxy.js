dojo.provide("drawboard.graph.CompositeProxy");
dojo.require("drawboard.graph.GraphProxy");
dojo.require("drawboard.Constant");
dojo.require("common.container.ListContainer");
(function(){
/**
 *	GraphItemFormatter:{
 *		gp:GraphProxy,
 *		oriPos:CoordinateFormatter,
 *		oriRotator:RotatorFormatter
 *	}
 * 
 */
var geometry = common.calc.Geometry,
	add = geometry.add2Points,
	subtract = geometry.subtract2Points,
	dConstant = drawboard.Constant.Decorate;
dojo.declare("drawboard.graph.CompositeProxy",[common.container.ListContainer,drawboard.graph.GraphProxy],{
	/*boolean*/_focus:false,		//if it is true,this composite proxy has been focus,maybe the child is focus.
	/*boolean*/_isComposite:true,
	/*boolean*/_operate:false,
	/*boolean*/isFocus:function(/*boolean*/focus){
		if(focus !== undefined){
			this._focus = focus;
		}
		return this._focus;
	},
	/*boolean*/contains:function(/*GraphProxy*/gp){
		if(!gp){
			return false;
		}
		var exist = false;
		this.some(function(/*GraphItemFormatter*/item){
			if(item.gp == gp){
				exist = true;
				return true;
			}
		},this);
		return exist;
	},
	/*void*/remove:function(/*GraphProxy*/gp){
		var index;
		this.some(function(/*GraphItemFormatter*/item,i){
			if(item.gp == gp){
				index = i;
				return true;
			}
		},this);
		drawboard.graph.CompositeProxy.superclass.remove.apply(this,[index]);
	},
	/*boolean*/equals:function(/*CompositeProxy*/cp){
		if(cp.size() != this.size()){
			return false;
		}
		var same = true;
		this.some(function(/*GraphItemFormatter*/item){
			if(!cp.contains(item.gp)){
				same = false;
				return true;
			}
		},this);
		return same;
	},
	/*void*/resetRelations:function(){
		var that = this,parent,gp;
		this.forInItems(function(/*GraphItemFormatter*/item){
			gp = item.gp;
			parent = (gp.getParent && gp.getParent());
			if(parent != that){
				parent && parent.remove(gp);
				gp.getParent = function(){
					return that;
				};
			}
		},this);
	},
	/**
	 * add children
	 */
	/*void*/add:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		drawboard.graph.CompositeProxy.superclass.add.apply(this,[{gp:gp,oriPos:gp.getCoordinate(runtime),oriRotator:dojo.clone(gp.getRotator(runtime))}]);
		if(geometry.graphContainsGraph(this.getSkeletonCoordinates(runtime),gp.getSkeletonCoordinates(runtime))){
			return;
		}
		var rect = geometry.getMaxRect(gp.getSkeletonCoordinates(runtime).concat(this.getSkeletonCoordinates(runtime)));
		this.setCoordinate({x:rect.x,y:rect.y},runtime);
		this.setWidth(rect.width,runtime);
		this.setHeight(rect.height,runtime);
		this.refresh(runtime);
	},
	/**
	 * set rotator
	 */
	/*void*/setRotator:function(/*Rotator*/rotator,/*ExecuteRuntime*/runtime,/*boolean*/maintain){
		this._operate = true;
		var r = this.getRotator(runtime),fixCoordinate,
			rotate = geometry.rotation,
			deltaAngle = rotator.angle - r.angle,
			contains = dojo.hitch(this,this.contains),
			graphs = [];
		this.inherited(arguments);
		if(maintain){return;}
		this.recursiveChild(graphs);
		dojo.forEach(graphs,function(/*GraphProxy*/gp){
			r = gp.getGraphRotator(runtime);
			r.angle += deltaAngle;
			fixCoordinate = gp.getNWCoordinate(runtime);
			fixCoordinate = rotate(rotate(fixCoordinate,rotator.coordinate,deltaAngle),rotate(r.coordinate,rotator.coordinate,deltaAngle),-r.angle);
			gp.setCoordinate(fixCoordinate,runtime);
			gp.setRotator(r,runtime,true);
			gp.refresh(runtime,function(/*GraphProxy*/gItem){
				if(contains(gItem)){
					return false;
				}
				return true;
			});
		},this);
		this._operate = false;
	},
	/*void*/recursiveChild:function(/*Array*/graphs){
		var gp;
		this.forInItems(function(/*GraphItemFormatter*/item){
			gp = item.gp;
			graphs.push(gp);
			if(gp.recursiveChild){
				gp.recursiveChild(graphs);
				return;
			}
		},this);
	},
	/**
	 * delete operation call
	 * @param db
	 */
	/*void*/deleteAll:function(/*DrawBoard*/db){
		this.forInItems(function(/*GraphItemFormatter*/item){
			db.removeGraph(item.gp);
		},this);
		this.destroy();
	},
	/**
	 * destroy self
	 */
	/*void*/destroy:function(){
		this.inherited(arguments);
		var gp;
		this.forInItems(function(/*GraphItemFormatter*/item){
			gp = item.gp;
			gp.getParent && (gp.getParent() == this) &&(delete gp.getParent);
		},this);
	},
	/**********************************************************************************************
	 * 										Action
	 **********************************************************************************************/
	/**
	 * draw the graph
	 */
	/*void*/draw:function(/*ExecuteRuntime*/runtime){
		this.inherited(arguments);
	},
	/**
	 * reset the graph size
	 * it is different with GraphProxy,the end paramter must exist 
	 */
	/*void*/sizeChange:function(/*Decorate*/decorate,/*CoordinateFormatter*/start,/*CoordinateFormatter*/end,/*ExecuteRuntime*/runtime){
		this._operate = true;
		var w = this.getWidth(runtime),
			h = this.getHeight(runtime),
			xRate = 1,yRate = 1,
			gp,nw,r,nnw,delta,coordinate,
			rotate = geometry.rotation,
			fixCoordinatePre = this.getSkeletonCoordinates(runtime)[0][0],
			rComposite = this.getRotator(runtime),
			contains = dojo.hitch(this,this.contains);
		this.inherited(arguments);
		xRate = this.getWidth(runtime)/w;
		yRate = this.getHeight(runtime)/h;
		fixCoordinate = this.getSkeletonCoordinates(runtime)[0][0];
		//like a zoom operation
		this.forInItems(function(/*GraphItemFormatter*/item){
			gp = item.gp;
			coordinate = gp.getCoordinate(runtime);
			//north west corner coordinate
			nw = gp.getNWCoordinate(runtime);
			nw = rotate(nw,fixCoordinatePre,-rComposite.angle);
			delta = subtract(nw,fixCoordinatePre);
			nw = rotate(add(fixCoordinatePre,{x:delta.x*xRate,y:delta.y*yRate}),fixCoordinatePre,rComposite.angle);
			nw = add(nw,subtract(fixCoordinate,fixCoordinatePre)); 
			
			gp.setWidth(gp.getWidth(runtime)*xRate,runtime);
			gp.setHeight(gp.getHeight(runtime)*yRate,runtime);
			
			runtime.clearCache(gp,dConstant.CENTER);
			r = gp.getGraphRotator(runtime);
			coordinate = gp.getCoordinate(runtime);
			nnw = rotate(coordinate,r.coordinate,r.angle);
			
			gp.setCoordinate(add(coordinate,subtract(nw,nnw)),runtime);
			gp.refresh(runtime,function(/*GraphProxy*/gItem){
				if(contains(gItem)){
					return false;
				}
				return true;
			});
		},this);
		this._operate = false;
	},
	/**
	 * move the graph position
	 */
	/*void*/move:function(/*CoordinateFormatter*/start,/*CoordinateFormatter*/end,/*ExecuteRuntime*/runtime){
		this._operate = true;
		this.inherited(arguments);
		this.forInItems(function(/*GraphItemFormatter*/item){
			if(item){
				item.oriPos = add(item.oriPos,subtract(end,start));
				item.gp.move(start,end,runtime);
			}
		},this);
		this._operate = false;
	},
	/**
	 * zoom out or zoom in
	 * @param rate
	 * @param runtime
	 */
	/*void*/zoom:function(/*{x:Double,y:Double}*/rate,/*ExecuteRuntime*/runtime){
		this._operate = true;
		this.inherited(arguments);
		this.forInItems(function(/*GraphItemFormatter*/item){
			if(item){
				item.gp.zoom(rate,runtime);
			}
		},this);
		this._operate = false;
	}
});
})();