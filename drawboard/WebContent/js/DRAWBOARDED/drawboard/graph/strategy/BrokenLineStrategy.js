/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.BrokenLineStrategy"]){dojo._hasResource["drawboard.graph.strategy.BrokenLineStrategy"]=true;dojo.provide("drawboard.graph.strategy.BrokenLineStrategy");dojo.require("drawboard.controller.StyleController");dojo.require("drawboard.graph.strategy.GraphStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant,_3=drawboard.relationController;dojo.declare("drawboard.graph.strategy.BrokenLineStrategy",drawboard.graph.strategy.GraphStrategy,{_hasRotator:false,isIn:function(gp,_4,_5){var p=gp.getCoordinate(_5),w=gp.getWidth(_5),h=gp.getHeight(_5),_6=gp.getRealMotionAnchors(_5),_7=dojo.hitch(_1,"isPointInSegment"),_8=_6.length,_9;if((_8==0)&&_7(p,{x:p.x+w,y:p.y+h},_4)){return true;}for(var i=0;i<_8;i++){_9=((i+1==_8)?{x:p.x+w,y:p.y+h}:_6[i+1]);if(i==0){if(_7(p,_6[i],_4)||_7(_6[i],_9,_4)){return true;}}else{if(i==_8-1){if(_7(_6[i],{x:p.x+w,y:p.y+h},_4)){return true;}}else{if(_7(_6[i],_9,_4)){return true;}}}}return false;},isAnchor:function(d){return true;},draw:function(gp,gf,_a){var p=_2.Path,_b=gp.getGraphCoordinates(_a),_c=_b.length-1,_d=[];for(var i=0;i<_c;i++){(i==0)?_d.push({command:p.MOVE,points:_b[i]},{command:p.LINE,points:_b[i+1]}):_d.push({command:p.LINE,points:_b[i]},{command:p.LINE,points:_b[i+1]});}gf.drawPath(_d,this.getStyle(gp,_a),true);},sizeChange:function(gp,_e,_f,_10){var d=_2.Direction,p=gp.getCoordinate(_10),w=gp.getWidth(_10),h=gp.getHeight(_10),_11=_f.x,_12=_f.y,_13=_e.getDirect(),_14=gp.getRealMotionAnchors(_10),_15=true,_16,tmp,_17=dojo.hitch(gp.getGraphStatus(),"setMotionAnchors");switch(_13){case d.WESTNORTH:gp.setCoordinate({x:p.x+_11,y:p.y+_12},_10);gp.setWidth(w-_11,_10);gp.setHeight(h-_12,_10);if(_14.length==0){tmp={x:p.x+w,y:p.y+h};_14.push({x:tmp.x,y:p.y+_12});break;}_16=_14[0];(_16.x==p.x)?(_15=true):(_15=false);if((_16.x==p.x)&&(_16.y==p.y)){tmp=_14[1];!tmp&&(tmp={x:p.x+w,y:y+h});(_16.x==tmp.x)?(_15=false):(_15=true);}(_15)&&((_16.x+=_11)!=null)&&(_17(_14,_10));(!_15)&&((_16.y+=_12)!=null)&&(_17(_14,_10));break;case d.EASTSOUTH:gp.setWidth(w+_11,_10);gp.setHeight(h+_12,_10);if(_14.length==0){tmp={x:p.x+w+_11,y:p.y+h+_12};_14.push({x:p.x,y:p.y+h+_12});break;}_16=_14[_14.length-1];(_16.x==(p.x+w))?(_15=true):(_15=false);if((_16.x==(p.x+w))&&(_16.y==(p.y+h))){tmp=_14[_14.length-2]||{x:p.x,y:p.y};(_16.x==tmp.x)?(_15=false):(_15=true);}(_15)&&((_16.x+=_11)!=null)&&(_17(_14,_10));(!_15)&&((_16.y+=_12)!=null)&&(_17(_14,_10));break;case d.END:break;default:break;}this._sizeChange(gp,_e,_f,_10);},getActiveAnchors:function(gp,_18){return drawboard.skeletonController.create(gp.getSkeletonCoordinates(_18));},getSkeletonCoordinates:function(gp,_19){var _1a=gp.getCoordinate(_19),w=gp.getWidth(_19),h=gp.getHeight(_19),x=_1a.x,y=_1a.y;return [{x:x,y:y,css:"mover_nw"},{x:x+w,y:y+h,css:"mover_se"}];},getGraphCoordinates:function(gp,_1b){var _1c=this.getMotionAnchorCoordinates(gp,_1b);start=gp.getCoordinate(_1b),w=gp.getWidth(_1b),h=gp.getHeight(_1b),x=start.x,y=start.y,graphs=[{x:x,y:y,css:"mover_nw",isAnchored:true}];dojo.forEach(_1c,function(_1d){graphs.push({x:_1d.x,y:_1d.y});},this);graphs.push({x:x+w,y:y+h,css:"mover_se",isAnchored:true});return graphs;},getMarkCoordinates:function(gp,_1e){return null;},getMotionAnchorCoordinates:function(gp,_1f){var _20=gp.getRealMotionAnchors(_1f),_21=[],_22=gp.getCoordinate(_1f),w=gp.getWidth(_1f),h=gp.getHeight(_1f),x=_22.x,y=_22.y,_23=_22,_24;(!_20)&&((_20=[{x:x+(w>>1),y:y},{x:x+(w>>1),y:y+h}])&&gp.getGraphStatus().setMotionAnchors(_20,_1f));if(_20.length==0){_21.push({x:_22.x+(w>>1),y:_22.y+(h>>1)});return _21;}dojo.forEach(_20,function(_25,_26){((_23.x==_25.x)||(_21.push({x:_23.x+((_25.x-_23.x)>>1),y:_23.y},{x:_25.x,y:_25.y})&&false))&&(_21.push({x:_23.x,y:_23.y+((_25.y-_23.y)>>1)},{x:_25.x,y:_25.y}));_23=_25;},this);_24=_20[_20.length-1];(_24.x==(x+w))&&(_21.push({x:_24.x,y:_24.y+((y+h-_24.y)>>1)}));(_24.y==(y+h))&&(_21.push({x:_24.x+((x+w-_24.x)>>1),y:_24.y}));return _21;},calcMotionAnchor:function(gp,_27,_28,_29){var _2a=gp.getRealMotionAnchors(_29),_2b=this.getActiveAnchors(gp,_29),_3=drawboard.relationController,_2c=gp.getCoordinate(_29),_2d=_27.getIndex(),_2e=Math.floor(_2d/2),len=_2a.length,_2f=_3.containRestrain(gp,_2b[0],_29),_30=_3.containRestrain(gp,_2b[1],_29),_31=((_2e==0)?_2c:_2a[_2e-1]),_32=((_2e==len-1)?{x:_2c.x+w,y:_2c.y+h}:_2a[_2e+1]),_33=_2a[_2e],tmp,_34;if(_2d%2==0){if(_2d==0){(!_33)&&(_33={x:_2c.x+w,y:_2c.y+h});if(_2f){if(!_30){(_33.x==_2c.x)&&(_2a.splice(0,0,{x:_2c.x,y:_2c.y+((_33.y-_2c.y)>>2)},{x:_28.x,y:_2c.y+((_33.y-_2c.y)>>2)}))&&(len>0?(_32.y=_28.y):(gp.setHeight(_28.y-_2c.y,_29)));(_33.y==_2c.y)&&(_2a.splice(0,0,{x:_2c.x+((_33.x-_2c.x)>>2),y:_2c.y},{x:_2c.x+((_33.x-_2c.x)>>2),y:_28.y}))&&(len>0?(_32.x=_28.x):(gp.setWidth(_28.x-_2c.x,_29)));_27.setIndex(3);}else{(_33.x==_2c.x)&&(_2a.splice(0,0,{x:_2c.x,y:_2c.y+((_33.y-_2c.y)>>2)},{x:_28.x,y:_2c.y+((_33.y-_2c.y)>>2)},{x:_28.x,y:_33.y-((_33.y-_2c.y)>>2)},{x:_2c.x,y:_33.y-((_33.y-_2c.y)>>2)}));(_33.y==_2c.y)&&(_2a.splice(0,0,{x:_2c.x+((_33.x-_2c.x)>>2),y:_2c.y},{x:_2c.x+((_33.x-_2c.x)>>2),y:_28.y},{x:_33.x-((_33.x-_2c.x)>>2),y:_28.y},{x:_33.x-((_33.x-_2c.x)>>2),y:_2c.y}));_27.setIndex(4);}}else{if(_30){if(!_2f){(_33.x==_2c.x)&&(_2a.splice(0,0,{x:_28.x,y:_2c.y+((_33.y-_2c.y)>>1)},{x:_33.x,y:_2c.y+((_33.y-_2c.y)>>1)}))&&(_2c.x=_28.x);(_33.y==_2c.y)&&(_2a.splice(0,0,{x:_2c.x+((_33.x-_2c.x)>>1),y:_28.y},{x:_2c.x+((_33.x-_2c.x)>>1),y:_33.y}))&&(_2c.y=_28.y);gp.setCoordinate(_2c,_29);_27.setIndex(1);}else{(_33.x==_2c.x)&&(_2a.splice(0,0,{x:_2c.x,y:_2c.y+((_33.y-_2c.y)>>2)},{x:_28.x,y:_2c.y+((_33.y-_2c.y)>>2)},{x:_28.x,y:_33.y-((_33.y-_2c.y)>>2)},{x:_2c.x,y:_33.y-((_33.y-_2c.y)>>2)}));(_33.y==_2c.y)&&(_2a.splice(0,0,{x:_2c.x+((_33.x-_2c.x)>>2),y:_2c.y},{x:_2c.x+((_33.x-_2c.x)>>2),y:_28.y},{x:_33.x-((_33.x-_2c.x)>>2),y:_28.y},{x:_33.x-((_33.x-_2c.x)>>2),y:_2c.y}));_27.setIndex(4);}}else{(_2c.x==_33.x)&&(gp.setWidth(gp.getWidth(_29)+(_2c.x-_28.x),_29)||((_2c.x=_33.x=_28.x)!=null)&&(gp.setCoordinate(_2c,_29)));(_2c.y==_33.y)&&(gp.setHeight(gp.getHeight(_29)+(_2c.y-_28.y),_29)||((_2c.y=_33.y=_28.y)!=null)&&(gp.setCoordinate(_2c,_29)));}}}else{if(_2e==len){_33=(len==0)?{x:_2c.x,y:_2c.y}:_2a[_2e-1];if(_30){if(!_2f){((_2c.x+w)==_33.x)&&(_2a.push({x:_28.x,y:_2c.y+h-((_2c.y+h-_33.y)>>2)},{x:_33.x,y:_2c.y+h-((_2c.y+h-_33.y)>>2)}))&&(_31.x=_28.x);((_2c.y+h)==_33.y)&&(_2a.push({x:_2c.x+w-((_2c.x+w-_33.x)>>2),y:_28.y},{x:_2c.x+w-((_2c.x+w-_33.x)>>2),y:_33.y}))&&(_31.y=_28.y);(len==0)&&(gp.setCoordinate(_31));_27.setIndex(_2d);}else{((_2c.x+w)==_33.x)&&(_2a.push({x:_33.x,y:_33.y+((_2c.y+h-_33.y)>>2)},{x:_28.x,y:_33.y+((_2c.y+h-_33.y)>>2)},{x:_28.x,y:_2c.y+h-((_2c.y+h-_33.y)>>2)},{x:_33.x,y:_2c.y+h-((_2c.y+h-_33.y)>>2)}));((_2c.y+h)==_33.y)&&(_2a.push({x:_33.x+((_2c.x+w-_33.x)>>2),y:_33.y},{x:_33.x+((_2c.x+w-_33.x)>>2),y:_28.y},{x:_2c.x+w-((_2c.x+w-_33.x)>>2),y:_28.y},{x:_2c.x+w-((_2c.x+w-_33.x)>>2),y:_33.y}));_27.setIndex(_2d+4);}}else{((_2c.x+w)==_33.x)&&(((_33.x=_28.x)!=null)&&(gp.setWidth(_28.x-_2c.x,_29)));((_2c.y+h)==_33.y)&&(((_33.y=_28.y)!=null)&&(gp.setHeight(_28.y-_2c.y,_29)));}}else{_31=_2a[_2e-1];(_31.x==_33.x)&&(_33.x=_31.x=_28.x);(_31.y==_33.y)&&(_33.y=_31.y=_28.y);}}}else{var end={x:_2c.x+w,y:_2c.y+h},_35,_36,_37=false,_38;if(((_2e==0)&&_2f)||((_2e==len-1)&&_30)){(((_31.x==_33.x)&&(_37=false)||(_28.x==_31.x))||((_31.y==_33.y)&&(_37=true)&&(_28.y==_31.y))||(((_2e==0)&&(_37?(_2f?(_2a.unshift({x:_31.x+((_33.x-_31.x)>>1),y:_31.y},{x:_31.x+((_33.x-_31.x)>>1),y:_28.y})):((((_2c.y=_28.y)!=null)&&(gp.setCoordinate(_2c,_29))||true)&&_2a.splice(1,0,{x:_28.x,y:_33.y+((_32.y-_33.y)>>1)},{x:_32.x,y:_33.y+((_32.y-_33.y)>>1)}))):(_2f?_2a.unshift({x:_31.x,y:_31.y+((_33.y-_31.y)>>1)},{x:_28.x,y:_31.y+((_33.y-_31.y)>>1)}):((((_2c.x=_28.x)!=null)&&(gp.setCoordinate(_2c,_29))||true)&&_2a.splice(1,0,{x:_33.x+((_32.x-_33.x)>>1),y:_28.y},{x:_33.x+((_32.x-_33.x)>>1),y:_32.y})&&(_38=1))))&&(_2f?(_2a[2]=_28):(_2a[0]=_28))&&(_27.setIndex(_38||5)))||((_2e==len-1)&&(_2e!=0)&&(_37?_2a.push({x:_28.x,y:_33.y+((end.y-_33.y)>>1)},{x:end.x,y:_33.y+((end.y-_33.y)>>1)}):_2a.push({x:_33.x+((end.x-_33.x)>>1),y:_28.y},{x:_33.x+((end.x-_33.x)>>1),y:end.y}))&&(_2a[_2e]=_28)||true)||true))&&(((_2e==len-1)?(_37?(_31.y=_28.y):(_31.x=_28.x)):(_37?(_32.x=_28.x):(_32.y=_28.y))));}else{(((_31.x==_33.x)&&(_31.y==_33.y))?(((((_2e<2)?((_2e==1)&&(tmp=_2c)):(tmp=_2a[_2e-2]))&&(tmp&&(_34=(tmp.x==_31.x))||true))||(((_2e<len-2)?(tmp=_2a[_2e+2]):((_2e==len-2)&&(tmp=end)))&&(tmp&&(_34=!(tmp.x==_32.x))||true)))):((_31.x==_33.x)?(_34=false):(_34=true)));if(!_34){(((_31.x=_28.x)!=null)&&((_32.y=_28.y)!=null)&&((_2e==0)&&(gp.setCoordinate(_2c,_29)||gp.setWidth(end.x-_2c.x,_29))))||((_2e==len-1)&&(gp.setHeight(_32.y-_2c.y,_29)));}else{(((_31.y=_28.y)!=null)&&((_32.x=_28.x)!=null)&&((_2e==0)&&(gp.setCoordinate(_2c,_29)||gp.setHeight(end.y-_2c.y,_29))))||((_2e==len-1)&&(gp.setWidth(_32.x-_2c.x,_29)));}((_33.x=_28.x)!=null)&&(_33.y=_28.y);}}return null;},normalize:function(gp,_39,_3a){gp&&_39&&this.updateMotionAnchors(gp,_3a,_39);return true;},updateMotionAnchors:function(gp,_3b,_3c){var _3d=gp.getRealMotionAnchors(_3b),_3e=gp.getCoordinate(_3b),_3f=[],_40=[],_41,_42,_43=_3c&&_3c.getIndex(),_44=false,_45,_46;(_41=-1)&&(_42={x:_3e.x,y:_3e.y});dojo.forEach(_3d.concat({x:_3e.x+gp.getWidth(_3b),y:_3e.y+gp.getHeight(_3b)}),function(_47,_48){if((_42.x==_47.x)&&(_42.y==_47.y)){_3f.push(_48);return;}if(_42.x==_47.x){_46=false;}else{_46=true;}(_45===undefined)&&_3f.push(_48);(_45!==undefined)&&(((_45==_46)&&_3f.push(_48))||((_3f.length>1)&&_40.push(_3f)&&false)||(_3f=[_48]));_45=_46;_42=_47;},this);(_3f.length>1)&&_40.push(_3f);dojo.forEach(_40.reverse(),function(_49){dojo.forEach(_49.reverse(),function(_4a,pos){(pos!=0)&&(_3d.splice(_4a,1))&&(_43!=null)&&((_43>_4a)&&((_43=_43-2)!=null)&&_3c.setIndex(_43));},this);},this);gp.getGraphStatus().setMotionAnchors(_3d,_3b);}});})();}