

( function( global, Snapshot, $ ) {

    "use strict";    

    function getPath(filename) {
        var ss = document.getElementsByTagName("script");
        for (var i = 0; i < ss.length; i++) {
            var src = ss[i].getAttribute("src") || "";
            if(src.indexOf(filename)>0){
                var path = src.substr(0, src.indexOf(filename));
                return path;
            }
        }
    }

    (function() {
        var path = getPath("snapshot-preview.js");
        var hm = document.createElement("script");
        hm.src = path+"/js/bootstrap.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

    Snapshot.register({
        name: "ss-consumer",
        consume: function(data) {
            if($("#ssModal").length==0){
                $("body").append(createModal());
            }
            var html = Snapshot.convert(data);
            html = "<div class=\"clearfix\">" +html+ "</div>";
            $("#ssModal .modal-body").html(html);
            $('#ssModal').modal({
              keyboard: false
            })
        }
    });

    Snapshot.register({
        name: "tpl-consumer",
        consume: function() {
            if($("#ssModal").length==0){
                $("body").append(createModal());
            }

            var tplName = arguments[0];
            var data = arguments[1];
            $.ajax({
                url: "/demo/default/"+tplName,
                method:"post",
                success: function(tpl) {
                    var html = tmpl(tpl, data);
                    html = "<div class=\"clearfix\">" +html+ "</div>";
                    $("#ssModal .modal-body").html(html);
                    $('#ssModal').modal({
                      keyboard: false
                    })
                }
            });
            
        }
    });

    var proxyAjax = function() {
        var _ajax_ = Snapshot._ajax_;
        Snapshot._ajax_ = function () {
        	var options = (typeof arguments[0] == "string")?arguments[1]:arguments[0];
        	var _ss = paramValue(options.data, "_ss")
        	if(_ss){
                if (confirm("是否查看快照结果？")){
                    console.log(decodeURIComponent(_ss));
				    var ss = JSON.parse(decodeURIComponent(_ss));
                    Snapshot.consume(ss);
			    }else{
                    _ajax_.apply($, arguments);
                }
        	}else{
                _ajax_.apply($, arguments);
            }            
        }
    }

    function paramValue(param, key){
    	if(typeof param == "string"){
            //TODO:
        }else if(typeof param == "object"){
            return param[key];
        }
    }

    function createIframe(){
		return '<iframe id="ss-preview-iframe1" class="modal-dialog" width="100%" height="50%" frameborder="0"></iframe>';
	}

    function createModal(){
        return '<!-- Modal -->\
<div class="modal fade" id="ssModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
  <div class="modal-dialog" style="width:800px;" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">Snapshot</h4>\
      </div>\
      <div class="modal-body">\
        ...\
      </div>\
      <div class="modal-footer">\
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
      </div>\
    </div>\
  </div>\
</div>';
    }

    proxyAjax();


} )( typeof window !== "undefined" ? window : this, Snapshot, jQuery );



