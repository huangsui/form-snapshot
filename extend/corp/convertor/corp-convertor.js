
const Snapshot = require('../snapshot-core');

"use strict";

var convertor = new function(){
    this.name = "corp-convertor";
    this.process = "corp-processor"
    this.init = function(config){

    };

    this.match = function(note){

        if(note.manifest == '!TEXT~~~GROUP'){
            console.log("match", note);
        }
        if(note.manifest == '!TEXT~~~GROUP' && note.subNotes[1].subNotes[2].nodeName == "SELECT" && note.subNotes[1].subNotes[2].assign == this.process){
            return true
        }

        return note.assign == this.process
    };

    this.convert= function(note){
        var html = ''
        if(note.manifest == '!TEXT~~~GROUP'){
            console.log("convert", note)
            html += "<label for='' >"+ note.subNotes[0].attrs.value +"</label>"
            html += "<input disabled='disabled' class='form-control' value='"+ note.subNotes[1].subNotes[2].attrs.value +"' />"
        }
        /*if(note.nodeName.toUpperCase()=="TABLE"){
            var html = '<table class="table table-bordered">';

            html += '<thead>';
            var ths = '';
            for(var j=0;j<note.value[0].length;j++){
                ths += '<th>' + note.value[0][j] + '</th>';
            }
            html += '<tr style="background-color: #F3F3F3;">' + ths + '</tr>';
            html += '</thead>';

            html += '<tbody>';
            for(var i=1;i<note.value.length;i++){
                var tds = '';
                for(var j=0;j<note.value[i].length;j++){
                    tds += '<td>' + note.value[i][j] + '</td>';
                }
                html += '<tr>' + tds + '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
        }else if(note.manifest=="!TEXT~SELECT"){
            var html = "<div  class=\"form-group col-md-12\">";

            var item1 = note.subNotes[0], item2 = note.subNotes[1];
            html += "<label for='' >"+item1.attrs.value+"</label>";
            html += "<input class='form-control' disabled='disabled' value='"+node2Html(item2.attrs.value)+"'/>";

            html +="</div>";
        }else if(note.manifest=="!TEXT~CHECKBOXES"){
            var html = "<div  class=\"form-group col-md-12\">";

            var item1 = note.subNotes[0], item2 = note.subNotes[1];
            html += "<label for='' >"+item1.attrs.value+"</label>";

            if(item2.nodeType=="CHECKBOXES"){
                for(var i=0;i<item2.subNotes.length;i++){
                    if(item2.subNotes[i].manifest=="CHECKBOX~TEXT"){
                        html += "<input type='checkbox' disabled='disabled'"+(item2.subNotes[i].attrs.checked?"checked":"")+"/><label class='cursor-hand'>"+node2Html(item2.subNotes[i].attrs.value)+"</label>";
                    }
                }
            }

            html +="</div>";
        }else if(note.nodeType=="ZTREE"){
            var html = '<div class="zTreeDemoBackground left">' +
                    '<ul id="tree" class="ztree menu-right-tree"></ul>' +
                '</div>';

            console.log(note);
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

            note.attrs.value.map(function (item) {
                item.chkDisabled=true;
                return item;
            });
            zNodes=note.attrs.value;
            setTimeout(function(){
                $.fn.zTree.init($("#tree"), setting, zNodes);
            },0);
        }else{
            html="";
        }
*/
        return html;
    };

    function node2Html(value){
        if(typeof value=="string" && $.trim(value)=="请选择"){
            value="";
        }
        return value;
    }

}

Snapshot.register(convertor);



