
const Snapshot = require('../../snapshot');

"use strict";

var pr = new function(){
    this.name = "bank-ztree-processor";

    this.beforeScan = function(note, node, ctx){
        if(typeof node.className=="string" && node.className.indexOf("ztree")>=0){          //代理树结构
            note.assign = this.name;
            note.manifest = "ITEM";

            note.nodeName="#ztree";
            var treeObj = $.fn.zTree.getZTreeObj(node.id);
            // var nodes = treeObj.transformToArray(treeObj.getNodes());
            note.value = treeObj.getNodes();
            note.nodeType = "ZTREE";
            note.manifest="ZTREE";
        }
        return note;
    };


    this.convert= function(note,ctx){

        if(note.nodeType=="ZTREE"){
            var html = '<div class="zTreeDemoBackground left">' +
                    '<ul id="tree" class="ztree menu-right-tree"></ul>' +
                '</div>';
            var setting = {
                view: {
                    selectedMulti: false
                },
                check: {
                    enable: true,
                    chkDisabledInherit: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: onCheck,
                    onExpand:onExpand
                }
            };
            var zNodes =[];

            note.value.map(function (item) {
                item.chkDisabled=true;
                return item;
            });
            zNodes=note.value;
            setTimeout(function(){
                $.fn.zTree.init($("#tree"), setting, zNodes);
            },0);
        }else{
            html="";
        }

        return html;
    };
}

Snapshot.cache(pr);

