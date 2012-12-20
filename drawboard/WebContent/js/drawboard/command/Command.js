dojo.provide("drawboard.command.Command");
dojo.require("common.command.Command");
dojo.require("common.exception.Exception");
dojo.require("drawboard.Constant");
(function(){
var commandType = drawboard.Constant.Command;
dojo.declare("drawboard.command.Command",common.command.Command,{
	/*Memo*/_memo:null,				//store a state information for execute,as parameters of the function execute.
	/*Object*/_executor:null,		//a executor which to use this state information
	/*Runtime*/_runtime:null,
	/*String*/_description:{},		//{0:positive description,1:negative description}
	/*void*/constructor:function(/*Object*/executor,/*Memo*/memo,/*boolean*/isNegative){
		if(!executor){
			new common.exception.Exception({msg:"the executor must be exist in the command!"});
			return;
		}
		this._executor = executor;
		this._memo = memo;
		if(!isNegative){
			this.execute = this.positive;
			this.unexecute = this.negative;
		}else{
			this.execute = this.negative;
			this.unexecute = this.positive;
		}
	},
	/*String*/getType:function(){
		//override by subclass
		return "";
	},
	/*Constant*/getConstant:function(){
		return commandType;
	},
	/*void*/setMemo:function(/*Memo*/memo){
		this._memo = memo;
	},
	/*Memo*/getMemo:function(){
		return this._memo;
	},
	/*void*/setRuntime:function(/*Runtime*/runtime){
		this._runtime = runtime;
	},
	/*Runtime*/getRuntime:function(){
		var runtime = this._runtime;
		if(!runtime){
			new common.exception.Exception({msg:"the runtime must be exist in the command!"});
		}
		return runtime;
	},
	/*Object*/getExecutor:function(){
		return this._executor;
	},
	/*void*/setExecutor:function(/*Object*/executor){
		this._executor = executor;
	},
	/*void*/execute:function(){
		//override by subclass
	},
	/*void*/unexecute:function(){
		//override by subclass
	},
	/*void*/positive:function(){
		//override by subclass
	},
	/*void*/negative:function(){
		//override by subclass
	},
	/*void*/setDescription:function(/*String*/desp0,/*String*/desp1){
		this._description = {first:desp0,second:desp1};
	},
	/*boolean*/isPositive:function(){
		if(this.execute == this.positive){
			return true;
		}
		return false;
	},
	/**
	 *	whether or not this command will be cancel out by another command which is in the same type.
	 */
	/*boolean*/isCancelOut:function(){
		return false;
	},
	/*void*/getDesciption:function(){
		var desp = this._description;
		if(this.isPositive()){
			return desp.first;
		}
		return desp.second;
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/merge:function(/*Command*/command){
		if(this.getType() != command.getType() || this.getExecutor() != command.getExecutor()){
			return false;
		}
		return this._merge(command);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		//override by subclass
	}
});
})();