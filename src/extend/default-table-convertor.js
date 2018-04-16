

const Snapshot = require('../snapshot');

"use strict";

var convertor = new function(){
    this.name = "default-table-convertor";
    this.bind = "default-table-processor";

    this.convert= function(note){

        var html = '<table class="table table-bordered">';

        html += '<thead>';
        var ths = '';
        for(var j=0;j<note.data[0].length;j++){
            ths += '<th>' + note.data[0][j] + '</th>';
        }
        html += '<tr style="background-color: #F3F3F3;">' + ths + '</tr>';
        html += '</thead>';

        html += '<tbody>';
        for(var i=1;i<note.data.length;i++){
            var tds = '';
            for(var j=0;j<note.data[i].length;j++){
                tds += '<td>' + note.data[i][j] + '</td>';
            }
            html += '<tr>' + tds + '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        return html;
    };
    
}

Snapshot.cache(convertor);



