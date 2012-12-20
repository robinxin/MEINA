dojo.provide("drawboard.command.CreateVSDeleteCommand");
dojo.require("drawboard.command.Command");
dojo.declare("drawboard.command.CreateVSDeleteCommand",drawboard.command.Command,{
	/*{[{gp:GraphProxy,gs:JSON]}*/_info:null,
	/*Integer*/index:null,
	/*String*/getType:function(){
		return this.getConstant().CREATEVSDELETECOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo(),				//graph proxy
			info = this._info,
			runtime = this.getRuntime(),
			styleCtrl = runtime.getContext().getStyleCtrl(),
			index = this.index;
		index === null ? executor.add(memo): executor.insert(this.index,memo);
		if(info){
			dojo.forEach(info,function(item){
				executor.insert(item.index,item.gp);
				item.gs && styleCtrl.addItem(item.gp.getIdty(),item.gs);
				memo.add(item.gp,runtime);
			},this);	
			memo.resetRelations();
		}
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo(),				//graph proxy
			info,runtime = this.getRuntime(),
			styleCtrl = runtime.getContext().getStyleCtrl();
		if(memo.isComposite()){
			if(!this._info){
				this._info = [];
			}
			info = this._info;
			var gp;
			memo.forInItems(function(/*GraphItemFormatter*/item){
				gp = item.gp;
				info.push({gp:gp,gs:styleCtrl.getItem(gp.getIdty()),index:executor.indexOf(gp)});
			},this);
		}
		this.index = executor.indexOf(memo);
		executor.removeGraph(memo);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		return false;
	}
});