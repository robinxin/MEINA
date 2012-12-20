dojo.provide("drawboard.graph.GraphProxy");
dojo.require("drawboard.graph.strategy.GraphStrategyFactory");
dojo.require("drawboard.controller.RelationController");
dojo.require("drawboard.graph.decorate.Mark");
dojo.require("drawboard.Constant");
dojo.require("common.calc.Geometry");
dojo.require("common.exception.Exception");
dojo.require("common.utils.CollectionUtils");
dojo.require("drawboard.graph.strategy.RectangleStrategy");
/**
 * we can get the rotator of graph status instance,by it only cause the start coordinate of graph change.
 * any other graph content will change by the rotator of the same angle with before,but pole is the center of the graph.
 */
(function(){
var constant = drawboard.Constant,
	decorateConstant = constant.Decorate,
	graphStrategyFactory = drawboard.GraphStrategyFactory,
	geometry = common.calc.Geometry,
	divide = geometry.dividePoint,
	add = geometry.add2Points,
	subtract = geometry.subtract2Points,
	rotate = geometry.rotation;
dojo.declare("drawboard.graph.GraphProxy",null,{
	/*GraphStatus*/_graphStatus:null,
	/*String*/_graphStrategyClass:null,
	/*boolean*/_isActive:false,
	/*boolean*/_isActived:false,
	/*boolean*/_isComposite:false,
	/*boolean*/_showMark:false,				//show mark in the graph shown,for selecting operation this value will be false
	
	/*void*/constructor:function(/*GraphStatus*/graphStatus,/*String*/graphStrategyClass){		
		graphStrategyClass = dojo.trim(graphStrategyClass);
		//dojo.require(pgraphStrategyClass);	
		this._graphStrategyClass = graphStrategyClass;
		this._graphStatus = graphStatus;
	},
	/*GraphStrategy*/getGraphStrategy:function(){
		return graphStrategyFactory.getGraphStrategy(this.getGraphStrategyClass());
	},
	/*String*/getGraphStrategyClass:function(){
		if(!this._graphStrategyClass){
			new common.exception.Exception({msg:"graph proxy must have an graph strategy class!"});
		}
		return this._graphStrategyClass;
	},
	/*GraphStatus*/getGraphStatus:function(){
		if(!this._graphStatus){
			new common.exception.Exception({msg:"graph status proxy must have an graph status instance!"});
		}
		return this._graphStatus;
	},
	/*void*/setRatio:function(/*Double*/ratio){
		return this.getGraphStatus().setRatio(ratio);
	},
	/*Double*/getRatio:function(){
		return this.getGraphStatus().getRatio();
	},
	/*void*/setText:function(/*String*/text){
		this.getGraphStatus().setText(text);
	},
	/*String*/getText:function(){
		return this.getGraphStatus().getText();
	},
	/*boolean*/isComposite:function(){
		return this._isComposite;
	},
	/*boolean*/showMark:function(/*boolean*/showMark){
		if(showMark !== undefined){
			this._showMark = showMark;
		}
		return this._showMark;
	},
	/**
	 * get the graph identity
	 */
	/*String*/getIdty:function(){
		return this.getGraphStatus().getIdty();
	},
	/*boolean*/isActive:function(/*boolean*/active){
		if(active !== null && active !== undefined){
			this._isActive = active;
		}
		return this._isActive;
	},
	/*boolean*/isActived:function(/*boolean*/active){
		if(active !== null && active !== undefined){
			this._isActived = active;
		}
		return this._isActived;
	},
	/**
	 * get the center coordinate in the graph
	 */
	/*CoordinateFormatter*/getCenter:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			center = cache[decorateConstant.CENTER];
		if(!center){
			var gs = this.getGraphStatus(),
				c = gs.getCoordinate(runtime),
				w = gs.getWidth(runtime),
				h = gs.getHeight(runtime);
			cache[decorateConstant.CENTER] = center = {x:c.x + (w>>1),y:c.y + (h>>1)};
		}
		return center;
	},
	/**
	 * get the start coordinate
	 */
	/*CoordinateFormatter*/getCoordinate:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStatus().getCoordinate(runtime);
	},
	/**
	 * set the start coordinate
	 */
	/*void*/setCoordinate:function(/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		this.getGraphStatus().setCoordinate(coordinate,runtime);
	},
	/**
	 * the pole of rotator will get by the rate of width
	 */
	/*void*/reset:function(/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var gs = this.getGraphStatus(),
			marks = gs.getMarks(runtime),
			motionAnchors = gs.getMotionAnchors(runtime);
//		delta = divide([delta],runtime.getContext().getZoom())[0];
		if(marks){
			dojo.forEach(marks,function(item){
				if(item){
					item.x += delta.x;
					item.y += delta.y;
				}
			},this);
			gs.setMarks(marks,runtime);
		}
		if(motionAnchors && !gs.isAffectedByZoom()){
			dojo.forEach(motionAnchors,function(mitem){
				if(mitem){
					mitem.x += delta.x;
					mitem.y += delta.y;
				}
			},this);
			gs.setMotionAnchors(motionAnchors,runtime);
		}
	},
	/**
	 * get the graph's width
	 */
	/*void*/getWidth:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStatus().getWidth(runtime);
	},
	/**
	 * set the graph's width
	 */
	/*void*/setWidth:function(/*Double*/w,/*ExecuteRuntime*/runtime){
		this.getGraphStatus().setWidth(w,runtime);
	},
	/**
	 * get the graph's height
	 */
	/*void*/getHeight:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStatus().getHeight(runtime);
	},
	/**
	 * set the graph's height
	 */
	/*void*/setHeight:function(/*Double*/h,/*ExecuteRuntime*/runtime){
		this.getGraphStatus().setHeight(h,runtime);
	},
	/**
	 * set rotator
	 */
	/*void*/setRotator:function(/*Rotator*/rotator,/*ExecuteRuntime*/runtime,/*boolean*/maintain){
		var gs = this.getGraphStatus(),
			gRotator = gs.getRotator();
		//the pole of the rotator may be not exist.
		(!gRotator)&&(gRotator = {angle:0});
		if(rotator.angle != gRotator.angle){
			gRotator.angle = rotator.angle;
		    gs.setRotator(gRotator);
		}else{
		    
		}
		!maintain && this.refresh(runtime);
	},
	/**
	 * get the graph's rotate information
	 */
	/*RotatorFormatter*/getRotator:function(/*ExecuteRuntime*/runtime){
		var gs = this.getGraphStatus(),
			rotator = gs.getRotator(),
			coordinate = gs.getCoordinate(runtime),
			h = gs.getHeight(runtime),
			w = gs.getWidth(runtime);
		return  {coordinate:{x:coordinate.x + (w>>1),y:coordinate.y + (h>>1)},angle:rotator?rotator.angle:0};
	},
	/**
	 * get the graph's rotate information,only for graph drawing according to the center of graph.
	 */
	/*RotatorFormatter*/getGraphRotator:function(/*ExecuteRuntime*/runtime){
		var gs = this.getGraphStatus(),
			strategy = this.getGraphStrategy(),
			angle = gs.getRotateAngle(),
			center = this.getCenter(runtime);
		if(!strategy.hasRotator()){
			return {coordinate:strategy.getRotatorCoordinate(this,runtime)||center,angle:angle};
		}
		return {coordinate:center,angle:angle};
	},
	/**
	 * get the graph's marks
	 */
	/*Array<CoordinateFormatter>*/getRealMarks:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStatus().getMarks(runtime);
	},
	/**
	 * get the graph's motion anchor
	 */
	/*Array<Object>*/getRealMotionAnchors:function(/*ExecuteRuntime*/runtime){
		return  this.getGraphStatus().getMotionAnchors(runtime); 
	},
	/**
	 * get resource url
	 */
	/*String*/getUrl:function(){
		return this.getGraphStatus().getUrl();
	},
	/**
	 * only for the composite proxy to fix position to the north west corner coordinate.
	 * @param runtime
	 * @returns
	 */
	/*CoordinateFormatter*/getNWCoordinate:function(/*ExecuteRuntime*/runtime){
		var rotator = this.getGraphRotator(runtime),
			pole = rotator.coordinate,
			a = rotator.angle;
		return rotate(this.getCoordinate(runtime),pole,a);
	},
	/**
	 * only for the composite proxy to fix position to the south east corner coordinate.
	 * @param runtime
	 * @returns
	 */
	/*CoordinateFormatter*/getSECoordinate:function(/*ExecuteRuntime*/runtime){
		var rotator = this.getGraphRotator(runtime),
			pole = rotator.coordinate,
			a = rotator.angle,
			coordinate = this.getCoordinate(runtime),
			w = this.getWidth(runtime),
			h = this.getHeight(runtime);
		return rotate({x:coordinate.x + (w>>1),y:coordinate.y + (h>>1)},pole,a);
	},
	/**
	 * get the coordinates,and then calculate the four corner of the point.
	 */
	/*Array<DecorateCoordinateFormatter>*/getCoordinatesByDeal:function(/*Function*/coordinatesGet,/*ExecuteRuntime*/runtime){
		var	coordinates = coordinatesGet(this,runtime);
		if(!coordinates || coordinates.length == 0){return null;}
		var r = runtime.getDistance(),
			rotator = this.getGraphRotator(runtime),
			pole = rotator.coordinate,
			copy4Attrs = common.utils.CollectionUtils.copy4Attrs,
			a = rotator.angle,p = coordinates[0],
			delta,temp;
		temp = rotate(p,pole,a);
		copy4Attrs(p,temp,{x:1,y:1});
		coordinates[0] = [temp,
		                //west north corner
						rotate({x:p.x - r,y:p.y - r},pole,a),
						//east north corner
				        rotate({x:p.x + r,y:p.y - r},pole,a),
				        //east south corner
				        rotate({x:p.x + r,y:p.y + r},pole,a),
				        //west south corner
				        rotate({x:p.x - r,y:p.y + r},pole,a)];
		dojo.forEach(coordinates,function(point,index){
			if(index != 0){
				temp = rotate(point,pole,a);
				copy4Attrs(point,temp,{x:1,y:1});
				delta = subtract(temp,coordinates[0][0]);
				coordinates[index] = [temp,
				                    add(coordinates[0][1],delta),
				                    add(coordinates[0][2],delta),
				                    add(coordinates[0][3],delta),
				                    add(coordinates[0][4],delta)];
			}
		},this);
		return coordinates;
	},
	/**
	 * calculate the graph' coordinate,will be call by the strategy
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			graphCache = cache[decorateConstant.Graph];
		if(!graphCache){
			var graphStrategy = this.getGraphStrategy(),
				rotator = this.getGraphRotator(runtime),
				pole = rotator.coordinate,
				a = rotator.angle,
				coordinates = graphStrategy.getGraphCoordinates(this,runtime);
			dojo.forEach(coordinates,function(item,index){
				coordinates[index] = rotate(item,pole,a);
			},this);
			cache[decorateConstant.Graph] = coordinates;
			return coordinates;
		}
		return graphCache;
	},
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			skeletonsCache = cache[decorateConstant.SKELETON];
		if(!skeletonsCache){
			var graphStrategy = this.getGraphStrategy(),
			 	skeletons = this.getCoordinatesByDeal(graphStrategy.getSkeletonCoordinates,runtime);
			cache[decorateConstant.SKELETON] = skeletons;
			return skeletons;
		}
		return skeletonsCache;
	},
	/**
	 * fetch the marks' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			marksCache = cache[decorateConstant.MARK];
		if(!marksCache){
			var graphStrategy = this.getGraphStrategy(),
				marks = this.getCoordinatesByDeal(graphStrategy.getMarkCoordinates,runtime);
			cache[decorateConstant.MARK] = marks;
			return marks;
		}
		return marksCache;
	},
	/**
	 * get the outlet of the graph
	 */
	/*Array<DecorateCoordinateFormatter>*/getOutletCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			outletCache = cache[decorateConstant.OUTLET];
		if(!outletCache){
			var outlet = new drawboard.graph.strategy.RectangleStrategy(),
				coordinates = outlet.getGraphCoordinates(this,runtime),
				rotator = this.getGraphRotator(runtime),
				pole = rotator.coordinate,
				a = rotator.angle;
			dojo.forEach(coordinates,function(item,index){
				coordinates[index] = rotate(item,pole,a);
			},this);
			cache[decorateConstant.OUTLET] = coordinates;
			return coordinates;
		}
		return outletCache;
	},
	/**
	 * whether or not the rotator is shown 
	 */
	/*boolean*/hasRotator:function(){
		return this.getGraphStrategy().hasRotator();
	},
	/**
	 * get the graph's rotate information
	 */
	/*RotatorFormatter*/getRotatorCoordinates:function(/*ExecuteRuntime*/runtime){
		if(!this.hasRotator()){
			return null;
		}
		var cache = this.getCache(runtime),
			rotatorCache = cache[decorateConstant.ROTATOR];
		if(!rotatorCache){
			var r = runtime.getDistance(),
				d = runtime.getRotateDistance(),
				rotator = this.getRotator(runtime),
				pole = rotator.coordinate,
				a = rotator.angle,
				start = this.getCoordinate(runtime),
				cross = {x:pole.x,y:start.y},
				rotatorCenter = this.getGraphRotator(runtime).coordinate,
				distant = geometry.getDistant(pole,rotate(cross,rotatorCenter,a)),
				handerOuter;
			(distant > 0) && (d += distant);
			handerOuter = rotate({x:pole.x,y:pole.y - d - r},pole,a);
			rotatorCache = [
			        //handler outer circle center
			        geometry.intersectCircleLine(handerOuter,r,handerOuter,{x:handerOuter.x,y:handerOuter.y + 10})[0],
			        //line coordinate near the handler outer circle
			        rotate({x:pole.x,y:pole.y - d},pole,a),
			        //line another coordinate
			        rotate({x:pole.x,y:pole.y - r},pole,a),
			        //handler inner circle center
			        {x:pole.x,y:pole.y},
			        //for isIn function line near the handler inner circle
			        rotate({x:pole.x,y:pole.y - 2 * r},pole,a),
			        // for isIn function handler outer circle center
			        handerOuter
		            ];
			cache[decorateConstant.ROTATOR] = rotatorCache;
			return rotatorCache;
		}
		return rotatorCache;
	},
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			motionAnchorCache = cache[decorateConstant.MOTIONANCHOR];
		if(!motionAnchorCache){
			var graphStrategy = this.getGraphStrategy(),
				motionAnchors = this.getCoordinatesByDeal(graphStrategy.getMotionAnchorCoordinates,runtime);
			cache[decorateConstant.MOTIONANCHOR] = motionAnchors;
			return motionAnchors;
		}
		return motionAnchorCache;
	},
	/**
	 * reset cache,and notify the listener.
	 */
	/*void*/refresh:function(/*ExecuteRuntime*/runtime,/*Function*/funct){
		//now only listen to the mark changes.
		var marksCache = this.getMarkCoordinates(runtime),marks,delta;
		this.clearCache(runtime);
		this.getSkeletonCoordinates(runtime);
		this.getMotionAnchorCoordinates(runtime);
		//listen to the mark changes.
		marks = this.getMarkCoordinates(runtime);
		dojo.forEach(marksCache,function(item,index){
			if(item[0] != marks[index][0]){
				delta = subtract(marks[index][0],item[0]);
				drawboard.relationController.fireEvent(this.getIdty(),new drawboard.graph.decorate.Mark({coordinate:[item[1],item[3],item[2],item[4]],index:index}),[delta],runtime,funct);
			}
		},this);
	},
	/**
	 * according to the instance to choose difference class
	 */
	/*Object*/getCache:function(/*ExecuteRuntime*/runtime){
		return runtime.getCache(this);
	},
	/**
	 * clear cache
	 */
	/*void*/clearCache:function(/*ExecuteRuntime*/runtime,/*Constant*/type){
		runtime.clearCache(this,type);
	},
	/**********************************************************************************************
	 * 										Action
	 **********************************************************************************************/
	/**
	 * draw the graph
	 */
	/*void*/draw:function(/*ExecuteRuntime*/runtime){
		this.getGraphStrategy().draw(this,runtime.getGraphic(),runtime);
		if(this.isActived()){
			var p = drawboard.Constant.Path,
				cache = this.getOutletCoordinates(runtime);
			runtime.getGraphic().drawPath([
					//west north corner
					{command:p.MOVE,points:cache[0]},
					//east north corner
					{command:p.LINE,points:cache[1]},
					//east south corner
					{command:p.LINE,points:cache[2]},
					//west south corner
					{command:p.LINE,points:cache[3]}
		            ],"fill:none;stroke:red;stroke-width:2");
		}
	},
	//something is wrong with size change method,will modify to zoom out or zoom in
	/**
	 * reset the graph size
	 * if the end doesn't exist,the start is a delta data
	 */
	/*void*/sizeChange:function(/*Decorate*/decorate,/*CoordinateFormatter*/start,/*CoordinateFormatter*/end,/*ExecuteRuntime*/runtime){
		var graphStrategy = this.getGraphStrategy(),
			grotator = this.getGraphRotator(runtime),
			gpole = grotator.coordinate,
			a = grotator.angle,
			delta = start,
			gp = this,
			hasRotator = graphStrategy.hasRotator(),oriFixObj = {};
		if(end !== null && end !== undefined){
			delta = subtract(end,start);
			if(hasRotator){
				var direct = decorate.getDirect(),
					d = constant.Direction,
					coordinate = this.getCoordinate(runtime),
					skeletons = this.getSkeletonCoordinates(runtime),oriFixPos,oriFixFunct;
				switch(direct){
					case d.NORTH:
					case d.WEST:
					case d.WESTNORTH:
						oriFixPos = skeletons[3][0];
						oriFixFunct = function(/*CoordinateFormatter*/pos,/*CoordinateFormatter*/p,/*Double*/a){
							gp.setCoordinate(add(coordinate,subtract(rotate(pos,p,-a),{x:coordinate.x + gp.getWidth(runtime),y:coordinate.y + gp.getHeight(runtime)})),runtime);
						};
						break;
					case d.EASTNORTH:
						oriFixPos = skeletons[2][0];
						oriFixFunct = function(/*CoordinateFormatter*/pos,/*CoordinateFormatter*/p,/*Double*/a){
							gp.setCoordinate(add(coordinate,subtract(rotate(pos,p,-a),{x:coordinate.x,y:coordinate.y + gp.getHeight(runtime)})),runtime);
						};
						break;
					case d.WESTSOUTH:
						oriFixPos = skeletons[1][0];
						oriFixFunct = function(/*CoordinateFormatter*/pos,/*CoordinateFormatter*/p,/*Double*/a){
							gp.setCoordinate(add(coordinate,subtract(rotate(pos,p,-a),{x:coordinate.x + gp.getWidth(runtime),y:coordinate.y})),runtime);
						};
						break;
					case d.SOUTH:
					case d.EAST:
					case d.EASTSOUTH:
						oriFixPos = skeletons[0][0];
						oriFixFunct = function(/*CoordinateFormatter*/pos,/*CoordinateFormatter*/p,/*Double*/a){
							pos = rotate(pos,p,-a);
							gp.setCoordinate(pos,runtime);
						};
						break;
					case d.END:
						break;
					default:
						break;
				}
				
				oriFixObj.oriFixPos = oriFixPos;
				oriFixObj.oriFixFunct = oriFixFunct;
				start = rotate(start,gpole,-a);
				end = rotate(end,gpole,-a);
				delta = subtract(end,start);
			}
		}
		graphStrategy.sizeChange(this,decorate,delta,runtime);
		if(hasRotator && a!=0 && oriFixObj !== undefined){
			this.clearCache(runtime,decorateConstant.CENTER);
			var npole = rotate(this.getCenter(runtime),gpole,a);
			oriFixObj.oriFixFunct(oriFixObj.oriFixPos,npole,a);
		}
		this.refresh(runtime);
	},
	/**
	 * this function will be called in case of mouse up event call
	 */
	/*void*/normalize:function(/*Decorator*/decorator,/*ExecuteRuntime*/runtime){
		var isRefresh = this.getGraphStrategy().normalize(this,decorator,runtime);
		isRefresh && this.refresh(runtime);
	},
	/**
	 * move the graph position
	 */
	/*void*/move:function(/*CoordinateFormatter*/start,/*CoordinateFormatter*/end,/*ExecuteRuntime*/runtime){
		var preCoordinate = this.getCoordinate(runtime),
			delta = subtract(end,start);
		this.setCoordinate({x:preCoordinate.x + delta.x,y:preCoordinate.y + delta.y},runtime);
		this.reset(delta,runtime);
		this.refresh(runtime);
	},
	/*void*/zoom:function(/*{x:Double,y:Double}*/rate,/*ExecuteRuntime*/runtime){
		this.refresh(runtime,function(){return false;});
	},
	/**
	 * move the motion anchor in the graph
	 */
	/*void*/moveMotionAnchor:function(/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var motionAnchor = this.getGraphStrategy().calcMotionAnchor(this,anchor,point,runtime),
			motionAnchors = this.getRealMotionAnchors(runtime);
		(anchor.getIndex() < motionAnchors.length) && (motionAnchor != null) &&(motionAnchors[anchor.getIndex()] = motionAnchor);
		this.refresh(runtime);
	},
	/*GraphProxy*/active:function(/*CoordinateFormatter*/p,/*ExecuteRuntime*/runtime){
		if(this.getGraphStrategy().isIn(this,p,runtime)){
			return this;
		}
		return null;
	},
	/*Array<Decorate<Skeleton>>*/getActiveAnchors:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStrategy().getActiveAnchors(this,runtime);
	},
	/*boolean*/isAnchor:function(/*Decorate*/d){
		return this.getGraphStrategy().isAnchor(d);
	},
	/*void*/deleteAll:function(/*DrawBoard*/db,/*ExecuteRuntime*/runtime){
		this.destroy(runtime);
	},
	/**
	 * destroy self
	 */
	/*void*/destroy:function(/*ExecuteRuntime*/runtime){
		drawboard.relationController.removeListener(this,null,runtime);
	}
});
})();