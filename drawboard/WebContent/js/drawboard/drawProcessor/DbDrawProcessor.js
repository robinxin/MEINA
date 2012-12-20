dojo.provide("drawboard.drawProcessor.DbDrawProcessor");
dojo.require("drawboard.graph.decorate.controller.MarkController");
dojo.require("drawboard.graph.decorate.controller.MotionAnchorController");
dojo.require("drawboard.graph.decorate.controller.RotatorController");
dojo.require("drawboard.graph.decorate.controller.SkeletonController");
dojo.require("drawboard.drawProcessor.DrawProcessor");
dojo.require("drawboard.Constant");
(function(){
dojo.declare("drawboard.drawProcessor.DbDrawProcessor",drawboard.drawProcessor.DrawProcessor,{
	/**
	 * draw a graph
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExcuteRuntime*/runtime){
		if(gp.isComposite() && !gp.isFocus()){
			return;
		}
		gp.draw(runtime);		 
		if(gp.isActive()){
			//draw the decorate graph
			drawboard.skeletonController.draw(gp,runtime);
			drawboard.motionAnchorController.draw(gp,runtime);
			drawboard.rotatorController.draw(gp,runtime);
		}
		((runtime.getShowMark() || gp.showMark()) || gp.isActive() || gp.isActived()) && drawboard.markController.draw(gp,runtime);
	},
	/**
	 * set a active status in draw board
	 */
	/*{active:GraphProxy,decorate:Decorate,status:Constant}*/setActive:function(/*GraphProxy*/gp,/*CoordinateFormatter*/p,/*boolean*/only,/*Controller*/compController,/*ExecuteRuntime*/runtime){
		var actionStatus = drawboard.Constant.ActionStatus,active,parent;
		if(gp && gp.isActive()){
			var controllers = [{controller:drawboard.skeletonController,status:actionStatus.RESIZING},
								{controller:drawboard.rotatorController,status:[actionStatus.POLEMOVING,actionStatus.ROTATING]},
								{controller:drawboard.markController,status:actionStatus.MARKING},
								{controller:drawboard.motionAnchorController,status:actionStatus.MOTION}
			                   ],controller,actDecorator,status;
			dojo.some(controllers,function(item){
				controller = item.controller;
				if(only && controller != compController){return;}
				if(!only && controller == compController){return;}
				actDecorator = controller.active(gp,p,runtime);
				if(actDecorator){
					active = {};
					status = item.status;
					//in case of rotator,the status is a array.
					if(dojo.isArray(status)){
						if(controller.isInPole(gp,p,runtime)){
							active.status = status[0];
						}else{
							active.status = status[1];
						}
					}else{
						active.status = status;
					}
					active.active = gp;
					active.decorate = actDecorator;
					return true;
				}	
			},this);
		}
		if(!active && gp.isComposite()){
			return null;
		}
		if(!active && gp.active(p,runtime)){
			parent = this.getActiveParent(gp);
			active = {};
			active.status = actionStatus.MOVING;
			if(parent && !parent.isFocus()){
				gp = parent;
			}
			active.active = gp;
			active.decorate = null;
		}
		return active;
	},
	/*GraphProxy*/getActiveParent:function(/*GraphProxy*/gp){
		var curParent = (gp.getParent && gp.getParent()),preParent,parent;
		do{
			//if it has been focus,so return previous object
			if(!curParent || curParent.isFocus()){
				parent = preParent;
				break;
			}
			preParent = curParent;
			curParent = (preParent.getParent && preParent.getParent());
		}while(true);
		return parent;
	}
});
})();
