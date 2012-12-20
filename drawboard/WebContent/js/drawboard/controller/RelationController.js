dojo.provide("drawboard.controller.RelationController");
dojo.require("drawboard.Constant");
dojo.require("common.container.MapContainer");
dojo.require("common.utils.CollectionUtils");
dojo.require("common.Cache");
(function(){
var symbol = drawboard.Constant.Symbol,
	hasAttr = common.utils.CollectionUtils.hasAttr;
dojo.declare("drawboard.controller.RelationController",[common.container.MapContainer,common.Cache],{
	/**
	 *	add listener
	 * @param gp			the graph proxy which contain the parameter d
	 * @param d				the decorate of mark
	 * @param restrainedGp  restrained graph proxy to the another graph proxy which contain the mark decorate
	 * @param restrainedGp	restrained decorate of graph proxy to the another graph proxy which contain the mark decorate
	 * @param runtime
	 */
	/*void*/addListener:function(/*GraphProxy*/gp,/*Decorate*/d,/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var idty = gp.getIdty(),
			relation = this.getItem(idty),item,
			exist = false,
			symbolStr = d.getType() + symbol.concat + d.getIndex();
		if(!relation){
			relation = {};
			this.addItem(idty,relation);
		}
		item = relation[symbolStr];
		if(!item){
			item = [];
			relation[symbolStr] = item;
		}
		dojo.some(item,function(i){
			if(i.gp == restrainedGp){
				exist = true;
				return true;
			}
		},this);
		if(!exist){
			item.push({gp:restrainedGp,decorate:restrainedD});
			this.addRestrainedCache(gp, d, restrainedGp, restrainedD,runtime);
		}
	},
	/**
	 * remove listener according to the restrained proxy graph,if decorate exist,will remove relation by the decorate,otherwize
	 * remove all relation of the proxy graph
	 *@param restrainedGp	proxy graph which be contrained by the mark decorate
	 *@param restrainedD	the decorate of the proxy graph above
	 *@param runtime
	 */
	/*void*/removeListener:function(/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var restraineds = this.removeRestrainedCache(restrainedGp, restrainedD,runtime),relation,item,symbolStr,dels,id;
		dojo.forEach(restraineds,function(item){
			id = item.id;
			relation = this.getItem(id);
			if(!relation){
				return;
			}
			dels = [];
			symbolStr = item.decorate.getType() + symbol.concat + item.decorate.getIndex();
			item = relation[symbolStr];
			dojo.forEach(item,function(restrained,index){
				if(restrained.gp != restrainedGp){
					return;
				}
				if(!restrainedD || (restrainedD && restrained.decorate.equal(restrainedD))){
					dels.push(index);
				}
			},this);
			dojo.forEach(dels.reverse(),function(index){
				item.splice(index,1);
			},this);
			delete relation[symbolStr];
			if(!hasAttr(relation)){
				this.removeItem(id);
			}
		},this);
	},
	
	/*void*/fireEvent:function(/*String*/idty,/*Decorate*/d,/*Array*/params,/*ExecuteRuntime*/runtime,/*Function*/isUpdateFunct){
		var relation = this.getItem(idty),item,temp;
		if(!relation){return;}
		item = relation[d.getType() + symbol.concat + d.getIndex()];
		item && dojo.forEach(item,function(i){
			if(isUpdateFunct && !isUpdateFunct(i.gp)){
				return;
			}
			temp = params.concat();
			temp.unshift(i.decorate);
			temp.push(null);
			temp.push(runtime);
			i.gp.sizeChange.apply(i.gp,temp);
		},this);
	},
	/*void*/addRestrainedCache:function(/*GraphProxy*/gp,/*Decorate*/d,/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var idty = gp.getIdty(),
			cache = this.getCache(runtime),
			restrained = cache[restrainedGp.getIdty()],
			symbolStr = restrainedD.getType() + symbol.concat + restrainedD.getIndex();
		if(!restrained){
			restrained = {};
			cache[restrainedGp.getIdty()] = restrained;
		}
		!restrained[symbolStr] &&(restrained[symbolStr] = {id:idty,gp:gp,decorate:d,restrainedGp:restrainedGp,restrainedD:restrainedD});
	},
	/*boolean*/containRestrain:function(/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var restrains = this.getRestrainedCache(restrainedGp,restrainedD,runtime);
		if(restrains && restrains.length > 0){
			return true;
		}
		return false;
	},
	/*Array<{id:idty,gp:GraphProxy,decorate:d}>*/getRestrainedCache:function(/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),restrained = cache[restrainedGp.getIdty()],restraineds;
		if(!restrained){return restraineds;}
		if(restrainedD){
			var symbolStr = restrainedD.getType() + symbol.concat + restrainedD.getIndex();
			restrained[symbolStr] && (restraineds = [restrained[symbolStr]]);
			return restraineds;
		}
		restraineds = [];
		for(var dIdty in restrained){
			restraineds.push(restrained[dIdty]);
		}
		return restraineds;
	},
	/*Array<{id:idty,decorate:d}>*/removeRestrainedCache:function(/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),restrained = cache[restrainedGp.getIdty()],restraineds;
		if(!restrained){return restraineds;}
		if(restrainedD){
			var symbolStr = restrainedD.getType() + symbol.concat + restrainedD.getIndex();
			restrained[symbolStr] && (restraineds = [restrained[symbolStr]]);
			delete restrained[symbolStr];
			if(!hasAttr(restrained)){
				delete cache[restrainedGp.getIdty()];
			}
			return restraineds;
		}
		restraineds = [];
		for(var dIdty in restrained){
			restraineds.push(restrained[dIdty]);
		}
		delete cache[restrainedGp.getIdty()];
		return restraineds;
	},
	/**
	 * create cache by subclass
	 */
	/*Object*/createCache:function(){
		return {};
	}
});
if(drawboard.relationController == null){
	drawboard.relationController = new drawboard.controller.RelationController();
}
})();