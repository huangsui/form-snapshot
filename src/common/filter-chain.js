

"use strict";

var FilterChain = function(){
    var filters = [],
    	curIdx = -1,
        weaved = {};
    this.push = function(filter){
        filters.push(filter);
    },
    this.resetIdx = function(){
        curIdx = -1;
    },
    this.filter = function(){
        curIdx++;
        if(curIdx < filters.length){                
            var result = filters[curIdx].filter(arguments, this);
            return result;
        }else{
            return this.invoke.apply(this, arguments);
        }            
    },
    this.invoke = function(){
        return weaved.method.apply(weaved.target, arguments);
    },
    this.weave = function(target, method){
        weaved.target = target;
        weaved.method = method;
        return (function(chain){
            return function(){
            	chain.resetIdx();
            	return chain.filter.apply(chain, arguments);
            }            
        })(this);
    }
};

module.exports = FilterChain;
