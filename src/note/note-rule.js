

"use strict";

const Util = require('../common/util.js');

/*
FACTOR = TEXT|INPUTS //TEXT可升级为LABEL
ITEM = (LABEL|TEXT)(~INPUTS)+
GROUP = ((LABEL|TEXT)?~)?ITEM+(~ITEM)*
GROUP = (LABEL|TEXT)~GROUP
PANEL = GROUP(~GROUP)*
PANEL = (LABEL|TEXT)~PANEL
*/
const ManifestFactors = ["TEXT", "INPUTS", "LABEL"];
const NodeNameFacotrs = ["#text","SELECT","INPUT", "TEXTAREA"];
const ManifestMapping = {"#text":"TEXT","SELECT":"INPUTS","INPUT":"INPUTS", "TEXTAREA":"INPUTS"};

var NoteRule = new function(){

	this.TEXT="TEXT";
	this.LABEL="LABEL";
	this.INPUTS="INPUTS";
	this.ITEM="ITEM";
	this.GROUP="GROUP";
	this.PANEL="PANEL";

    const GRADE = {
        "TEXT":"0",
        "LABEL":"0",
        "INPUTS":"0",
        "ITEM":"1",
        "GROUP":"2",
        "PANEL":"3"
    }

    this.isNodeNameFactor = function(nodeName){
        return NodeNameFacotrs.indexOf(nodeName)!=-1;
    };
    this.isFactor = function(manifest){
    	return ManifestFactors.indexOf(manifest)!=-1;
    };
    this.isItem = function(manifest){
    	return /^(LABEL|TEXT)(~INPUTS)+$/g.test(manifest) || /^INPUTS~TEXT$/g.test(manifest);
    };
    this.isGroup = function(manifest){
    	return /^((LABEL|TEXT)?~)?ITEM+(~ITEM)+$/g.test(manifest) || /^(LABEL|TEXT)~GROUP$/g.test(manifest);
    };
    this.isPanel = function(manifest){
    	return /^GROUP(~GROUP)+$/g.test(manifest) || /^(LABEL|TEXT)~PANEL$/g.test(manifest);
    };
    this.getManifest = function(factor){
    	return ManifestMapping[factor];
    };
    this.getGrade = function(manifest){
        return GRADE[manifest]||-1;
    };
    this.upgradeManifest = function(manifest){
        switch(manifest){
            case this.ITEM:
                return this.GROUP;
            case this.GROUP:
                return this.PANEL;
            default:
                return manifest;
        }
    };


}

module.exports = NoteRule;

