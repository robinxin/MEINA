/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.Constant"]){dojo._hasResource["drawboard.Constant"]=true;dojo.provide("drawboard.Constant");drawboard.Constant={MouseAction:{NONE:0,MOUSEDOWN:1,MOUSEMOVE:2,MOUSEUP:3,MOUSEOVER:4,MOUSECLICK:5,MOUSEOUT:6},ActionStatus:{NONE:0,SELECTING:1,DRAWING:2,MOVING:3,MARKING:4,RESIZING:5,ROTATING:6,POLEMOVING:7,MOTION:8,TEXT:9},Decorate:{SKELETON:0,MARK:1,ROTATOR:2,MOTIONANCHOR:3,CHARACTER:4,Graph:5,CENTER:6,OUTLET:7},Direction:{EAST:0,EASTNORTH:1,NORTH:2,WESTNORTH:3,WEST:4,WESTSOUTH:5,SOUTH:6,EASTSOUTH:7,END:8},Path:{NONE:"",MOVE:"M",RMOVE:"m",LINE:"L",RLINE:"l",HORIZON:"H",RHORIZON:"h",VERTICAL:"V",RVERTICAL:"v",CUBIC:"C",RCUBIC:"c",CUBICSMOOTH:"S",CUBICRSMOOTH:"s",QUADRATIC:"Q",RQUADRATIC:"q",QUADRATICSMOOTH:"T",RQUADRATICSMOOTH:"t",ARC:"A",RARC:"a",CLOSE:"Z",RCLOSE:"z"},Command:{CREATEVSDELETECOMMAND:"createvsdelete",RESIZECOMMAND:"resize",MOVECOMMAND:"move",ROTATECOMMAND:"rotate",ZOOMCOMMAND:"zoom",STYLECOMMAND:"style",ADDVSDELTECONSTRAINCOMMAND:"addvsdeleteconstrain",COMBINEVSDEVIDEDCOMMAND:"combinevsdevided",COMPOSITECOMMAND:"composite",MOTIONCOMMAND:"motion"},Symbol:{concat:"&&"},Toolbar:{COLORPALETTE:0,DROPDOWNLIST:1,DIALOGUE:2}};}