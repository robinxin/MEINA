dojo.provide("drawboard.command.CompositeCommand");
dojo.require("common.container.ListContainer");
dojo.require("drawboard.command.Command");
dojo.declare("drawboard.command.CompositeCommand",[drawboard.command.Command,common.container.ListContainer],{
	/*void*/constructor:function(){
		this.execute =  this.positive;
		this.unexecute = this.negative;
	},
	/*String*/getType:function(){
		return this.getConstant().COMPOSITECOMMAND;
	},
	/*void*/add:function(/*Command*/command){
		var last = this.last(),
			len = this.size();
		if(len == 0 ||(last && !last.merge(command))){
			drawboard.command.CompositeCommand.superclass.add.call(this,command);
			return;
		}
	},
	/*void*/positive:function(){
		this.forInItems(function(/*Command*/command){
			command.execute();
		},this);
	},
	/*void*/negative:function(){
		this.forInItems(function(/*Command*/command){
			command.unexecute();
		},this);
	}
});