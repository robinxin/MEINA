dojo.provide("common.container.ListContainer");
dojo.require("dojox.collections.ArrayList");
dojo.declare("common.container.ListContainer",null,{
	/*ArrayList*/list:null,
	/*void*/constructor:function(){
		this.list = new dojox.collections.ArrayList();
	},
	/*Array*/getList:function(){
		return this.list.toArray();
	},
	/*boolean*/contains:function(value){
		if(this.list.contains(value)){
			return true;
		}
		return false;
	},
	/*Object*/get:function(/*Integer*/index){
		return this.list.item(index);
	},
	/*void*/add:function(/*Object*/value){
		if(!this.contains(value)){
			this.list.add(value);
		}
	},
	/*void*/remove:function(/*Integer|Object*/index){
		var list = this.list;
		if(typeof index == "object"){
			this.list.remove(index);
			return;
		}
		if(index > list.count - 1){return;}
		this.list.removeAt(index);
	},
	/*void*/insert:function(/*Integer*/index,/*Object*/item){
		this.list.insert(index,item);
	},
	/*Object*/pop:function(){
		var list = this.list,obj;
		if(list.count == 0){return null;}
		obj = list.item(list.count - 1);
		list.removeAt(list.count - 1);
		return obj;
	},
	/*Object*/shift:function(){
		var list = this.list,obj;
		if(list.count == 0){return null;}
		obj = list.item(0);
		list.removeAt(0);
		return obj;
	},
	/*Object*/first:function(){
		var list = this.list,obj;
		if(list.count == 0){return null;}
		obj = list.item(0);
		return obj;
	},
	/*Object*/last:function(){
		var list = this.list,obj;
		if(list.count == 0){return null;}
		obj = list.item(list.count - 1);
		return obj;
	},
	/*Integer*/size:function(){
		return this.list.count;
	},
	/*Integer*/indexOf:function(/*Object*/item){
		return this.list.indexOf(item);
	},
	/**
	 * move item from original position to new position
	 */
	/*void*/move:function(/*Integer*/oriIndex,/*Integer*/newIndex){
		var item = this.get(oriIndex);
		this.remove(oriIndex);
		this.insert(newIndex, item);
	},
	/*void*/clearItems:function(){
		this.list.clear();
	},
	/*void*/forInItems:function(/*Function*/f,/*Object?*/o,/*boolean*/reverse){
		if(!f){return;}
		o = o || this;
		var list = this.list.toArray();
		dojo.forEach(reverse?list.reverse():list,f,o);
	},
	/*void*/some:function(/*Function*/f,/*Object*/o,/*boolean*/reverse){
		if(!f){return;}
		o = o || this;
		var list = this.list.toArray();
		dojo.some(reverse?list.reverse():list,f,o);
	},
	/*void*/concat:function(list){
		this.list.addRange(list);
	}
});