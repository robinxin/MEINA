dojo.provide("drawboard.controller.CommandController");
dojo.require("common.container.ListContainer");
dojo.require("common.container.MapContainer");
dojo.require("common.exception.Exception");
dojo.require("dojo.data.ItemFileReadStore");
dojo.declare("drawboard.controller.CommandController",common.container.MapContainer,{
	/*String*/resouce:drawboardRuntimeSetting.commands,
	/*ListContainer*/_undoList:null,
	/*ListContainer*/_redoList:null,
	/*Integer*/maxSteps:20,
	/*Read*/store:null,
	/*void*/constructor:function(){
		var list = common.container.ListContainer;
		this._undoList = new list();
		this._redoList = new list();
		this.render();
	},
	/*Read*/getReadStore:function(){
		var store = this.store;
		if(!store){
			store = new dojo.data.ItemFileReadStore({url:this.resouce});
			store._forceLoad();
			this.store = store;
		}
		return this.store;
	},
	/*void*/render:function(){
		var store = this.getReadStore(),type,command,desp0,desp1;
		dojo.forEach(store._getItemsArray(),function(item){
			type = store.getValue(item,"type");
			command = store.getValue(item,"command");
			//eval('dojo.require("' + command + '")');
			desp0 = store.getValue(item,"desp0");
			desp1 = store.getValue(item,"desp1");
			this.registerCommand(type,command,desp0,desp1);
		},this);
	},
	/**
	 * register the commands
	 */
	/*void*/registerCommand:function(/*Constant*/type,/*String*/command,/*String*/desp0,/*String*/desp1){
		this.addItem(type,{command:command,0:desp0,1:desp1});
	},
	/**
	 * get command instance , and store to the undo/redo queue.
	 * @param type		command type
	 * @param memo		the parameters for command execute 
	 * @param runtime	execute runtime context
	 */
	/*Command*/instanceCommand:function(/*Constant*/type,/*Object*/executor,/*Memo*/memo,/*boolean*/isNegative,/*Runtime*/runtime){
		var item = this.getItem(type),command,instance;
		if(!item){
			new common.exception.Exception({msg:"the command type doesn't exsit!"});
			return;
		}
		//command = eval("new " + item.command + "(executor,memo,isNegative)");
		instance = eval(item.command);
		command = new instance(executor,memo,isNegative);
		command.setDescription({0:item.desp0,1:item.desp1});
		command.setRuntime(runtime);
		return command;
	},
	/*void*/add:function(/*Command*/command){
		var undoList = this._undoList;
		undoList.add(command);
		if(undoList.size() > this.maxSteps){
			undoList.shift();
		}
		this._redoList.clearItems();
	},
	/**
	 * undo the command
	 */
	/*void*/undo:function(){
		var command = this._undoList.pop();
		if(!command){return;}
		command.unexecute();
		this._redoList.add(command);
	},
	/**
	 * redo the command
	 */
	/*void*/redo:function(){
		var command = this._redoList.pop();
		if(!command){
			return;
		}
		command.execute();
		this._undoList.add(command);
	}
});