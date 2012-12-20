dojo.provide("common.listener.Listener");
dojo.declare("common.listener.Listener",null,{
	/*ArrayList*/_listeners:null,
	/*void*/constructor:function(){
		this._listeners = new dojox.collections.ArrayList();
	},
	/**
	 * whether or not the listener exist
	 * @param value
	 * @returns {Boolean}
	 */
	/*boolean*/containsListener:function(value){
		if(this._listeners.contains(value)){
			return true;
		}
		return false;
	},
	/**
	 * add listener item
	 * @param funct
	 * @param env
	 */
	/*void*/addListener:function(/*Function*/funct,/*Object*/env){
		var item = {funct:funct,env:env};
		if(!this.containsListener(item)){
			this._listeners.add(item);
		}
	},
	/**
	 * fire listener
	 */
	/*void*/fireListener:function(/*Array*/params){
		this.forInListeners(function(item,index){
			item.funct.apply(item.env||window,params||[]);
		},this);
	},
	/**
	 * remove listener item
	 * @param env
	 */
	/*void*/removeListener:function(/*Object*/env){
		this.forInListeners(function(item,index){
			if(item.env == env){
				this.remove(index);
			}
		},this,true);
	},
	/*void*/forInListeners:function(/*Function*/f,/*Object?*/o,/*boolean*/reverse){
		if(!f){return;}
		o = o || this;
		var list = this._listeners.toArray();
		dojo.forEach(reverse?list.reverse():list,f,o);
	},
	/**
	 * clear all listener items
	 */
	/*void*/clear:function(){
		this._listeners.clear();
	}
});