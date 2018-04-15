

"use strict";

const Util = require('../common/util.js');

/*
FACTOR = TEXT|INPUTS //TEXT可升级为LABEL
ITEM = (LABEL|TEXT)(~INPUTS)+
GROUP = ((LABEL|TEXT)?~)?ITEM+(~ITEM)*
PANEL = GROUP(~GROUP)*
CUSTOM=.{0,100}
*/
const Factors = ["#text","SELECT","INPUT", "TEXTAREA"];
const ManifestMapping = {"#text":"TEXT","SELECT":"INPUTS","INPUT":"INPUTS", "TEXTAREA":"INPUTS"};

var NodeRule = new function(){

	this.TEXT="TEXT";
	this.LABEL="LABEL";
	this.INPUTS="INPUTS";
	this.ITEM="ITEM";
	this.GROUP="GROUP";
	this.PANEL="PANEL";
	this.CUSTOM="CUSTOM";

    this.isFactor = function(manifest){
    	return Factors.indexOf(manifest)!=-1;
    };
    this.isItem = function(manifest){
    	return /^(LABEL|TEXT)(~INPUTS)+$/g.test(manifest);
    };
    this.isGroup = function(manifest){
    	return /^((LABEL|TEXT)?~)?ITEM+(~ITEM)*$/g.test(manifest);
    };
    this.isPanel = function(manifest){
    	return /^GROUP(~GROUP)*$/g.test(manifest);
    };
    this.isCustom = function(){
    	return CUSTOM = manifest;
    };
    this.getManifest = function(factor){
    	return ManifestMapping[factor];
    }

}

module.exports = NodeRule;

