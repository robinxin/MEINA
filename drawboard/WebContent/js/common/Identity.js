dojo.provide("common.Identity");
dojo.require("dojo.dnd.common");
dojo.declare("common.Identity",null,{
	/*String*/idty:null,
	/*String*/preIdt:null,
	/*String*/getIdty:function(){
		if(!this.idty){
			this.idty = this.generateIdty();
		}
		return this.idty;
	},
	/*String*/generateIdty:function(){
		var idt = dojo.dnd.getUniqueId();
		return this.preIdt?this.preIdt + "_" + idt:idt;
	}
});