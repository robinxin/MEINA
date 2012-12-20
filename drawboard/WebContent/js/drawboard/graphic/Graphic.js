//interface of the graphic to draw kinds of graphs.
dojo.provide("drawboard.graphic.Graphic");
dojo.declare("drawboard.graphic.Graphic",null,{
	/*Node*/createAnchor:function(/*Double*/w,/*Double*/h,/*Node*/parent){},
	/*boolean*/ready:function(){return true},
	/*Node|void*/setStyle:function(/*String*/style){},
	/*Node|void*/drawLine:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/style){},
	/*Node|void*/drawRect:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/style){},
	/*Node|void*/drawCircle:function(/*CoordinateFormatter*/coordinate,/*Double*/r,/*String*/style){},
	/*Node|void*/drawEllipse:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Map*/attrs,/*String*/style){},
	/*Node|void*/drawPath:function(/*Array<{command:"",points:[CoordinateFormatter]|CoordinateFormatter}>*/coordinates,/*String*/style){},
	/*Node|void*/drawImage:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/url,/*Map*/attrs,/*String*/style){},
	/*Node|void*/drawText:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/textConent,/*Map*/attrs){},
	/*void*/setSize:function(/*Double*/w,/*Double*/h){},
	/*void*/clear:function(){}
});