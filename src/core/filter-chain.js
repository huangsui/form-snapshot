

"use strict";

var FilterChain = function(){
    var filters = [],
    	curIdx = -1,
    	targetFn = null;
    this.add = function(filter){
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
        var result = targetFn.apply(this, arguments);
        return result;
    },
    this.weave = function(fn){
        targetFn = fn;
        return (function(chain){
            return function(){
            	chain.resetIdx();
            	return chain.filter.apply(chain, arguments);
            }            
        })(this);
    }
};

module.exports = FilterChain;
