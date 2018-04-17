
const Snapshot = require('../../snapshot');

"use strict";

var pr = new function(){
    this.name = "bank-bttable-processor";

    this.beforeScan = function(note, node, ctx){
        if(node.className == "fixed-table-body"){       //代理bootstrap-table
            note.assign = this.name;
            note.manifest = "GROUP";
        }
        return note;
    };

    this.process= function(note, node, ctx){

        if(node.className == "fixed-table-body"){
            var array=[];
            var array1=[];
            var $ths=$(node).find("tr").eq(0).find("th");
            for(var i=0;i<$ths.length;i++){
                array1.push($.trim($ths.eq(i).text()));
            }
            array.push(array1);
            var $trs=$(node).find("tr");
            for(var i=1;i<$trs.length;i++){
                var array2=[];
                var $tr = $trs.eq(i);
                var $tds = $tr.find("td");
                for(var j=0;j<$tds.length;j++){
                    var node=$tds.eq(j).children(":first").get(0);
                    if(node){
                        if(node.nodeName=="INPUT"){
                            array2.push($tds.eq(j).find("input").val());
                        }
                        if(node.nodeName=="SELECT"){
                            array2.push($tds.eq(j).find("select").find("option:selected").text());
                        }
                        if(node.nodeName=="A"){
                            var aString="";
                            var len=$tds.eq(j).find("a").length;
                            if(len>1){
                                for(var k=0;k<len;k++){
                                    aString+=$tds.eq(j).find("a").eq(k).text()+" ";
                                }
                            }else{
                                aString=$tds.eq(j).find("a").text();
                            }
                            array2.push(aString);
                        }
                        if(node.nodeName=="SPAN"){
                            array2.push($tds.eq(j).text());
                        }
                    }else {
                        array2.push($tds.eq(j).text());
                    }
                }
                array.push(array2);
            }
            note.value=array;
            note.nodeName="table";
            console.log(note);
        }
        
        note.assign = this.name;
        return note;
    };

    this.convert= function(note,ctx){

        if(note.nodeName.toUpperCase()=="TABLE"){
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
        }

        return html;
    };

    function node2Html(value){
        if(typeof value=="string" && $.trim(value)=="请选择"){
            value="";
        }
        return value;
    }
}

Snapshot.register(pr);

