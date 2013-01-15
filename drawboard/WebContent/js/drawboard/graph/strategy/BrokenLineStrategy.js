dojo.provide("drawboard.graph.strategy.BrokenLineStrategy");
dojo.require("drawboard.controller.StyleController");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant,
	relationCtrl = drawboard.relationController;
dojo.declare("drawboard.graph.strategy.BrokenLineStrategy",drawboard.graph.strategy.GraphStrategy,{
	/*boolean*/_hasRotator:false,
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			motionAnchors = gp.getRealMotionAnchors(runtime),
			pointInSegment = dojo.hitch(geometry,"isPointInSegment"),
			max = motionAnchors.length,next;
		if((max == 0) && pointInSegment(p,{x:p.x + w,y:p.y + h},point)){
			return true;
		}
		for(var i = 0;i < max;i++){
			next = ((i + 1 == max)?{x:p.x + w,y:p.y + h}:motionAnchors[i + 1]);
			if(i == 0){
				if(pointInSegment(p,motionAnchors[i],point)||pointInSegment(motionAnchors[i],next,point)){
					return true;
				}
			}else if(i == max - 1){
				if(pointInSegment(motionAnchors[i],{x:p.x + w,y:p.y + h},point)){
					return true;
				}
			}else{
				if(pointInSegment(motionAnchors[i],next,point)){
					return true;
				}
			}
		}
		return false;
	},
	
	/*boolean*/isAnchor:function(/*Decorate*/d){
		return true;
	},
	
	/**
	 * draw graph only
	 */
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime),
			max = cache.length - 1,path = [];
		for(var i = 0;i < max;i++){
			(i == 0)?path.push({command:p.MOVE,points:cache[i]},{command:p.LINE,points:cache[i+1]}): path.push({command:p.LINE,points:cache[i]},{command:p.LINE,points:cache[i+1]});
		}
		return gf.drawPath(path,this.getStyle(gp,runtime),true);
	},
	
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			deltaX = delta.x,
			deltaY = delta.y,
			direct = decorate.getDirect(),
			motionAnchors = gp.getRealMotionAnchors(runtime),
			isHorizontal = true,anchor,tmp,
			setMotionAnchors = dojo.hitch(gp.getGraphStatus(),"setMotionAnchors");
		//decorate is a Skeleton instance
		switch(direct){
			case d.WESTNORTH:
				gp.setCoordinate({x:p.x + deltaX,y:p.y + deltaY},runtime);
				gp.setWidth(w - deltaX,runtime);
				gp.setHeight(h - deltaY,runtime);
				if(motionAnchors.length == 0){
					tmp = {x:p.x + w,y:p.y + h};
					motionAnchors.push({x:tmp.x,y:p.y + deltaY});
					break;
				}
				anchor = motionAnchors[0];
				(anchor.x == p.x)? (isHorizontal = true):(isHorizontal = false);
				if((anchor.x == p.x) && (anchor.y == p.y)){
					tmp = motionAnchors[1];
					!tmp && (tmp = {x:p.x + w,y:y + h});
					(anchor.x == tmp.x)? (isHorizontal = false):(isHorizontal = true);
				}
				(isHorizontal) && ((anchor.x += deltaX)!=null)&&(setMotionAnchors(motionAnchors,runtime));
				(!isHorizontal) && ((anchor.y += deltaY)!=null)&&(setMotionAnchors(motionAnchors,runtime));
				break;
			case d.EASTSOUTH:
				gp.setWidth(w + deltaX,runtime);
				gp.setHeight(h + deltaY,runtime);
				if(motionAnchors.length == 0){
					tmp = {x:p.x + w + deltaX,y:p.y + h + deltaY};
					motionAnchors.push({x:p.x,y:p.y + h + deltaY});
					break;
				}
				anchor = motionAnchors[motionAnchors.length -1];
				(anchor.x == (p.x + w))? (isHorizontal = true):(isHorizontal = false);
				if((anchor.x == (p.x + w)) && (anchor.y == (p.y + h))){
					tmp = motionAnchors[motionAnchors.length -2]||{x:p.x,y:p.y};
					(anchor.x == tmp.x)? (isHorizontal = false):(isHorizontal = true);
				}
				(isHorizontal) && ((anchor.x += deltaX)!=null)&&(setMotionAnchors(motionAnchors,runtime));
				(!isHorizontal) && ((anchor.y += deltaY)!=null)&&(setMotionAnchors(motionAnchors,runtime));
				break;
			case d.END:
				break;
			default:
				break;
		}
		this._sizeChange(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime);
	},
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return drawboard.skeletonController.create(gp.getSkeletonCoordinates(runtime));
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
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw"},
		    		//east south corner
		    		{x:x + w,y:y + h,css:"mover_se"}
		        ];
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var cache = this.getMotionAnchorCoordinates(gp,runtime);
			start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y,
			graphs = [
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw",isAnchored:true}
					];
		dojo.forEach(cache,function(item){
			graphs.push({x:item.x,y:item.y});
		},this);
   		//east south corner
		graphs.push({x:x + w,y:y + h,css:"mover_se",isAnchored:true});
		return graphs;
	},
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	},
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var motionAnchors = gp.getRealMotionAnchors(runtime),
			cache = [],
			start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y,
			preTmp = start,lastTmp;
		(!motionAnchors)&& ((motionAnchors = [{x:x+(w>>1),y:y},{x:x+(w>>1),y:y+h}])&&gp.getGraphStatus().setMotionAnchors(motionAnchors,runtime));
		//(!motionAnchors)&& ((motionAnchors = [{x:x,y:y + h}])&&gp.getGraphStatus().setMotionAnchors(motionAnchors,runtime));
		if(motionAnchors.length == 0){
			cache.push({x:start.x + (w>>1),y:start.y + (h>>1)});
			return cache;
		}
		dojo.forEach(motionAnchors,function(coordinate,index){
			((preTmp.x == coordinate.x)||
				(cache.push({x:preTmp.x + ((coordinate.x - preTmp.x)>>1),y:preTmp.y},{x:coordinate.x,y:coordinate.y})&&false))&&
				(cache.push({x:preTmp.x,y:preTmp.y + ((coordinate.y - preTmp.y)>>1)},{x:coordinate.x,y:coordinate.y}));
			preTmp = coordinate;
		},this);
		lastTmp = motionAnchors[motionAnchors.length - 1];
		(lastTmp.x == (x + w)) && (cache.push({x:lastTmp.x,y:lastTmp.y + ((y + h - lastTmp.y)>>1)}));
		(lastTmp.y == (y + h)) && (cache.push({x:lastTmp.x + ((x + w - lastTmp.x)>>1),y:lastTmp.y}));
		return cache;
	},
	/**
	 * motion anchor arithmetic
	 */
	/*Object*/calcMotionAnchor:function(/*GraphProxy*/gp,/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var motionAnchors = gp.getRealMotionAnchors(runtime),
			activeAnchors = this.getActiveAnchors(gp,runtime),
			relationCtrl = drawboard.relationController,
			start = gp.getCoordinate(runtime),
			index = anchor.getIndex(),
			pIndex = Math.floor(index/2),
			len = motionAnchors.length,
			fixStart = relationCtrl.containRestrain(gp,activeAnchors[0],runtime),
			fixEnd = relationCtrl.containRestrain(gp,activeAnchors[1],runtime),
			preTmp = ((pIndex == 0)? start : motionAnchors[pIndex - 1]),
			nextTmp = ((pIndex == len - 1) ? {x:start.x + w,y:start.y + h} : motionAnchors[pIndex + 1]),
			anchorTmp = motionAnchors[pIndex],tmp,preStatus;//if status is true,it indicate that the direction is horintal
		//the motion anchors only store the corner points.
		//update the motion anchors
		if(index%2 == 0){
			//in the middle of line
			if(index == 0){
				//first point
				(!anchorTmp) && (anchorTmp = {x:start.x + w,y:start.y + h});
				if(fixStart){
					if(!fixEnd){
						(anchorTmp.x == start.x) &&(motionAnchors.splice(0,0,{x:start.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:start.y + ((anchorTmp.y - start.y)>>2)}))&&(len > 0?(nextTmp.y = point.y):(gp.setHeight(point.y - start.y,runtime)));
						(anchorTmp.y == start.y) &&(motionAnchors.splice(0,0,{x:start.x + ((anchorTmp.x - start.x)>>2),y:start.y},{x:start.x + ((anchorTmp.x - start.x)>>2),y:point.y}))&&(len > 0?(nextTmp.x = point.x):(gp.setWidth(point.x - start.x,runtime)));
						anchor.setIndex(3);
					}else{
						(anchorTmp.x == start.x) &&(motionAnchors.splice(0,0,{x:start.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:anchorTmp.y - ((anchorTmp.y - start.y)>>2)},{x:start.x,y:anchorTmp.y - ((anchorTmp.y - start.y)>>2)}));
						(anchorTmp.y == start.y) &&(motionAnchors.splice(0,0,{x:start.x + ((anchorTmp.x - start.x)>>2),y:start.y},{x:start.x + ((anchorTmp.x - start.x)>>2),y:point.y},{x:anchorTmp.x - ((anchorTmp.x - start.x)>>2),y:point.y},{x:anchorTmp.x - ((anchorTmp.x - start.x)>>2),y:start.y}));
						anchor.setIndex(4);
					}
				}else if(fixEnd){
					if(!fixStart){
						(anchorTmp.x == start.x) &&(motionAnchors.splice(0,0,{x:point.x,y:start.y + ((anchorTmp.y - start.y)>>1)},{x:anchorTmp.x,y:start.y + ((anchorTmp.y - start.y)>>1)}))&&(start.x = point.x);
						(anchorTmp.y == start.y) &&(motionAnchors.splice(0,0,{x:start.x + ((anchorTmp.x - start.x)>>1),y:point.y},{x:start.x + ((anchorTmp.x - start.x)>>1),y:anchorTmp.y}))&&(start.y = point.y);
						gp.setCoordinate(start,runtime);
						anchor.setIndex(1);
					}else{
						(anchorTmp.x == start.x) &&(motionAnchors.splice(0,0,{x:start.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:anchorTmp.y - ((anchorTmp.y - start.y)>>2)},{x:start.x,y:anchorTmp.y - ((anchorTmp.y - start.y)>>2)}));
						(anchorTmp.y == start.y) &&(motionAnchors.splice(0,0,{x:start.x + ((anchorTmp.x - start.x)>>2),y:start.y},{x:start.x + ((anchorTmp.x - start.x)>>2),y:point.y},{x:anchorTmp.x - ((anchorTmp.x - start.x)>>2),y:point.y},{x:anchorTmp.x - ((anchorTmp.x - start.x)>>2),y:start.y}));
						anchor.setIndex(4);
					}
				}else{
					(start.x == anchorTmp.x)&&(gp.setWidth(gp.getWidth(runtime) + (start.x - point.x),runtime)||((start.x = anchorTmp.x = point.x) != null)&&(gp.setCoordinate(start,runtime)));
					(start.y == anchorTmp.y)&&(gp.setHeight(gp.getHeight(runtime) + (start.y - point.y),runtime)||((start.y = anchorTmp.y = point.y) != null)&&(gp.setCoordinate(start,runtime)));
				}
			}else if(pIndex == len){
				//last point
				anchorTmp = (len == 0)?{x:start.x,y:start.y}:motionAnchors[pIndex - 1];
				if(fixEnd){
					if(!fixStart){
						((start.x + w) == anchorTmp.x)&&(motionAnchors.push({x:point.x,y:start.y + h - ((start.y + h - anchorTmp.y)>>2)},{x:anchorTmp.x,y:start.y + h - ((start.y + h - anchorTmp.y)>>2)}))&&(preTmp.x = point.x);
						((start.y + h) == anchorTmp.y)&&(motionAnchors.push({x:start.x + w - ((start.x + w - anchorTmp.x)>>2),y:point.y},{x:start.x + w - ((start.x + w - anchorTmp.x)>>2),y:anchorTmp.y}))&&(preTmp.y = point.y);
						(len == 0)&&(gp.setCoordinate(preTmp));
						anchor.setIndex(index);
					}else{
						((start.x + w) == anchorTmp.x)&&(motionAnchors.push({x:anchorTmp.x,y:anchorTmp.y + ((start.y + h - anchorTmp.y)>>2)},{x:point.x,y:anchorTmp.y + ((start.y + h - anchorTmp.y)>>2)},{x:point.x,y:start.y + h - ((start.y + h - anchorTmp.y)>>2)},{x:anchorTmp.x,y:start.y + h - ((start.y + h - anchorTmp.y)>>2)}));
						((start.y + h) == anchorTmp.y)&&(motionAnchors.push({x:anchorTmp.x + ((start.x + w - anchorTmp.x)>>2),y:anchorTmp.y},{x:anchorTmp.x + ((start.x + w - anchorTmp.x)>>2),y:point.y},{x:start.x + w - ((start.x + w - anchorTmp.x)>>2),y:point.y},{x:start.x + w - ((start.x + w - anchorTmp.x)>>2),y:anchorTmp.y}));
						anchor.setIndex(index + 4);
					}
				}else{
					((start.x + w) == anchorTmp.x)&&(((anchorTmp.x = point.x) != null)&&(gp.setWidth(point.x - start.x,runtime)));
					((start.y + h) == anchorTmp.y)&&(((anchorTmp.y = point.y) != null)&&(gp.setHeight(point.y - start.y,runtime)));
				}
			}else{
				preTmp = motionAnchors[pIndex - 1];
				(preTmp.x == anchorTmp.x) && (anchorTmp.x = preTmp.x = point.x);
				(preTmp.y == anchorTmp.y) && (anchorTmp.y = preTmp.y = point.y);
			}
		}else{
			//the point is one of double sides of line
			var end = {x:start.x+w,y:start.y+h},fixPoint,newPoint,isHorizontal = false,idxTmp;
			if(((pIndex == 0) && fixStart) || ((pIndex == len - 1) && fixEnd)){
				(
				  ((preTmp.x == anchorTmp.x) && (isHorizontal = false) || (point.x == preTmp.x))
					||((preTmp.y == anchorTmp.y) && (isHorizontal = true) && (point.y == preTmp.y))
					||(
						((pIndex == 0)&&(isHorizontal?
							(fixStart?(motionAnchors.unshift({x:preTmp.x + ((anchorTmp.x - preTmp.x)>>1),y:preTmp.y},{x:preTmp.x + ((anchorTmp.x - preTmp.x)>>1),y:point.y})):((((start.y = point.y)!=null) && (gp.setCoordinate(start,runtime))||true) && motionAnchors.splice(1,0,{x:point.x,y:anchorTmp.y + ((nextTmp.y - anchorTmp.y)>>1)},{x:nextTmp.x,y:anchorTmp.y + ((nextTmp.y - anchorTmp.y)>>1)}))):
							(fixStart?motionAnchors.unshift({x:preTmp.x,y:preTmp.y + ((anchorTmp.y - preTmp.y)>>1)},{x:point.x,y:preTmp.y + ((anchorTmp.y - preTmp.y)>>1)}):
								((((start.x = point.x)!=null)&&(gp.setCoordinate(start,runtime))||true)&& motionAnchors.splice(1,0,{x:anchorTmp.x + ((nextTmp.x - anchorTmp.x)>>1),y:point.y},{x:anchorTmp.x + ((nextTmp.x - anchorTmp.x)>>1),y:nextTmp.y})&&(idxTmp = 1))))&&
						(fixStart?(motionAnchors[2] = point):(motionAnchors[0] = point))&&(anchor.setIndex(idxTmp||5)))
						||((pIndex == len - 1) && (pIndex != 0) && 
						(isHorizontal?
							motionAnchors.push({x:point.x,y:anchorTmp.y + ((end.y - anchorTmp.y)>>1)},{x:end.x,y:anchorTmp.y + ((end.y - anchorTmp.y)>>1)}):
							motionAnchors.push({x:anchorTmp.x + ((end.x - anchorTmp.x)>>1),y:point.y},{x:anchorTmp.x + ((end.x - anchorTmp.x)>>1),y:end.y}))&&(motionAnchors[pIndex] = point)|| true)
						||true)
				)&&(
				  ((pIndex == len - 1)?(isHorizontal?(preTmp.y = point.y):(preTmp.x = point.x)):(isHorizontal?(nextTmp.x = point.x):(nextTmp.y = point.y)))
				);
			}else{		
				(
					((preTmp.x == anchorTmp.x)&&(preTmp.y == anchorTmp.y))?(
						(
						(((pIndex < 2)?((pIndex == 1)&&(tmp = start)):(tmp = motionAnchors[pIndex - 2]))&&(tmp && (preStatus = (tmp.x == preTmp.x))||true)) 
						 ||(((pIndex < len - 2)?(tmp = motionAnchors[pIndex + 2]):((pIndex == len - 2)&&(tmp = end)))&&(tmp && (preStatus = !(tmp.x == nextTmp.x)) || true))
						 )
					):((preTmp.x == anchorTmp.x)?(preStatus = false):(preStatus = true))	
				);
				if(!preStatus){
					(((preTmp.x = point.x)!=null)&&((nextTmp.y = point.y)!=null)&&
						((pIndex == 0)&&(gp.setCoordinate(start,runtime)||gp.setWidth(end.x - start.x,runtime))))||
						((pIndex == len - 1)&&(gp.setHeight(nextTmp.y - start.y,runtime)));
				}else{
					(((preTmp.y = point.y)!=null)&&((nextTmp.x = point.x)!=null)&&
						((pIndex == 0)&&(gp.setCoordinate(start,runtime)||gp.setHeight(end.y - start.y,runtime))))||
						((pIndex == len - 1)&&(gp.setWidth(nextTmp.x - start.x,runtime)));
				}
				((anchorTmp.x = point.x)!=null)&&(anchorTmp.y = point.y);
			}
		}
		return null;
	},
	/**
	 * this function will be called in case of mouse up event call
	 */
	/*boolean*/normalize:function(/*GraphProxy*/gp,/*Decorator*/decorator,/*ExecuteRuntime*/runtime){
		gp && decorator && this.updateMotionAnchors(gp,runtime,decorator);
		return true;
	},
	/*
	 * update the motion anchors,if more than two points are in the same direction line,then delete the poins in the middle.
	 */
	/*void*/updateMotionAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime,/*MotionAnchor*/anchor){
		var motionAnchors = gp.getRealMotionAnchors(runtime),
			start = gp.getCoordinate(runtime),	
			delPs = [],delIndexs = [],pIndex,preTmp,
			index = anchor && anchor.getIndex(),
			isCorner=false,preStatus,curStatus;				//if status is true,it indicate that the direction is horintal
		(pIndex = -1)&&(preTmp = {x:start.x,y:start.y});
		dojo.forEach(motionAnchors.concat({x:start.x + gp.getWidth(runtime),y:start.y + gp.getHeight(runtime)}),function(manchor,mIndex){
			if((preTmp.x == manchor.x) && (preTmp.y == manchor.y)){
				delPs.push(mIndex);
				return;
			}
			if(preTmp.x == manchor.x){
				curStatus = false;
			}else{
				curStatus = true;
			}
			(preStatus === undefined) && delPs.push(mIndex);
			(preStatus !== undefined) && (((preStatus == curStatus) && delPs.push(mIndex))||((delPs.length > 1) && delIndexs.push(delPs)&&false)||(delPs = [mIndex]));
			preStatus = curStatus;
			preTmp = manchor;
			/**
			(((preTmp.x == manchor.x)&&((preTmp.y = null)||(delete preTmp.y)&&(curStatus = true)))
			  ||((preTmp.y == manchor.y)&&((preTmp.x = null)||(delete preTmp.x)&&(curStatus = false)||true))
			  ||(((pIndex = mIndex) != null)&&((preTmp = dojo.clone(manchor))!=null)&&(isCorner = true)&&(((delPs.length > 2)&&(delIndexs.push(delPs)))||true)&&((preStatus = curStatus = !curStatus)!=null)&&(delPs = [mIndex])&&false))
				&&((((preStatus!=null) && isCorner && (curStatus == preStatus)&& (delPs[0] - 1 != -1) && delPs.unshift(delPs[0] - 1))||true)&&(isCorner = false)||(delPs.push(mIndex)));
			*/
		},this);
		(delPs.length > 1)&&delIndexs.push(delPs);
		dojo.forEach(delIndexs.reverse(),function(/*Array*/item){
			dojo.forEach(item.reverse(),function(dindex,pos){
				(pos != 0) && (motionAnchors.splice(dindex,1)) && (index != null) && ((index > dindex)&&((index = index - 2)!=null) && anchor.setIndex(index));
			},this);	
		},this);
		gp.getGraphStatus().setMotionAnchors(motionAnchors,runtime);
	}
});
})();