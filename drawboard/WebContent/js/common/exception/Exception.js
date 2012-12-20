dojo.provide("common.exception.Exception");
dojo.require("dijit._Widget");
dojo.require("common.Constant");
dojo.declare("common.exception.Exception",dijit._Widget,{
	msg:"",
	type:common.Constant.Exception.WARNNING,
	/*void*/postCreate:function(){
		var excepType = common.Constant.Exception,
			msg = this.msg; 
		switch(this.type){
			case excepType.WARNNING:
				this.printMessage();
				break;
			case excepType.ERROR:
				this.throwMessage();
				break;
		}
	},
	/*void*/throwMessage:function(/*String*/msg){
		throw msg;
	},
	/*void*/printMessage:function(/*String*/msg){
		console.info(msg);
	}
});