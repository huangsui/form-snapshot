
( function( global ) {

    "use strict";

    var SnapshotPreviewer = function(){//level 2
        
        


    };


    function createIframe(){
		return '<iframe id="iframe1" class="modal-dialog" width="100%" height="50%" frameborder="0"></iframe>';
	}

	function createSnapshotBtn(){
		return '<input id="snapshot-btn" type="button" class="demo-btn" name="snapshot-btn" value="Snapshot" data-toggle="modal" data-target="#exampleModal"/>';
	}

    global.snapshotPreviewer = new SnapshotPreviewer();

} )( typeof window !== "undefined" ? window : this );




function renderModal(){
	Snapshot.init( [rootParser, defaultParser, formitemGroupParser] );
	var assembler = Snapshot.load( $("body")[0] );
	assembler.desc2Json();
	$("#exampleModal .modal-body").html( assembler.json2html() );
}


$(function(){
	$("#snapshot-btn").on("click", function(){
		renderModal();
	});
});

