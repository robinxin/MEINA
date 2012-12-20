dojo.provide("common.command.Command");
dojo.declare("common.command.Command",null,{
	/*void*/execute:function(){
		//override by subclass
	},
	/*void*/unexecute:function(){
		//override by subclass
	}
});