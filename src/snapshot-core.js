

/**
 * 表单快照核心组件
 * 
 * Note: 便签，记录节点相关信息
 * Filter：过滤器，对每个节点扫描前后进行过滤 
 * Catcher: 捕捉者，
 * ProcessContext：上下文，节点处理时提供上下文信息
 * Manifest：货单，简单的节点描述规则，方便识别
 * 
 * !!TEXT~INPUTS~~!TEXT~INPUTS
 *  
 * 统一前缀：s-
 * 
 */

( function ( global, $ ) {

    "use strict"

    const VERSION = "1.0.0";/*版本*/
    const Note = require('./core/note-factory.js');
    const FilterChain = require('./core/filter-chain.js');
    const HtmlFactory = require('./core/note-convert.js');
    const Util = require('./common/util.js');
    const Cache = require('./common/cache.js');

    var that = this;
    var htmlFactory = new HtmlFactory();
    var aCache = new Cache();
    var processors = [];
    var filterChain = new FilterChain();

    var ProcessContext = function(node, opts){
        this.noteRoot = null;
        this.pnote = null;
        this.curNote = null;
        this.opts = opts;
        this.depth = function(){
            if(this.pnote){
                return this.pnote.depth+1;
            }
            return 1;
        };
        this.appendNote = function(note){
            if(this.noteRoot == null){
                this.noteRoot = note;
            }else{
                this.pnote.appendChild(note);
            }            
        };
        this.removeNote = function(note){
            this.pnote.removeChild(note);
        }
    }

    var scan = function(node, note, ctx){
        if(node.childNodes.length>0){
            var _pnote = ctx.pnote || ctx.noteRoot;
            ctx.pnote = note;

            $.each(node.childNodes, function(idx, subNode){
                var subNote = note.createSubNote(subNode);
                var result = through( subNode, subNote, ctx );
                if(result){
                    note.appendChild(result);
                }
            });

            ctx.pnote = _pnote;            
        }

        note.makeManifest(node, ctx);
    }

    var through = function( node, note, ctx ) {
        var result = note;

        for( var i=0; i < processors.length; i++ ){
            var pr = processors[i];
            if(pr.matchNode && pr.matchNode(node, note, ctx)){
                return pr.process(node, note, ctx);
            }else if(note.assign){
                break;
            }
        }

        scan( node, note, ctx );
        
        if(note.assign){
            for( var i=0; i < processors.length; i++ ){
                var pr = processors[i];
                if(pr.name == note.assign){
                    return pr.process(node, note, ctx);
                }
            }
        }else{
            //有货单
            for( var i=0; i < processors.length; i++ ){
                var pr = processors[i];
                if(pr.matchManifest && pr.matchManifest(node, note, ctx)){
                    return pr.process(node, note, ctx);
                }
            }
        }
       
        return note;            
        
    };
    
    through = filterChain.weave(through);

    var Snapshot = function( options ) {

        this.takeSnap = function( selector, opts ){
            var node = $(selector)[0];
            var pctx = new ProcessContext(node, opts);
            var note = new Note(node);
            pctx.appendNote(note);
            var result = through(node, note, pctx);
            return result;
        };

        this.init( options );

    };


    Snapshot.cache = function(){
        return aCache.cache.apply(aCache, arguments);
    }

    Snapshot.register = function(){
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if(typeof arg == "string"){
                var m = Snapshot.cache(arg);
                if(m){
                    Snapshot.register(m);
                }else{
                    throw "Snapshot cannot find \""+arg+"\" in caches ";
                }
            }else if(arg.name.indexOf("-processor")>0){
                processors.push(arg);
                if(typeof arg.convert === "function"){
                    htmlFactory.equip(arg);
                    console.log("register convertor:"+arg.name);
                }
            }else if(arg.name.indexOf("-filter")>0){
                filterChain.add(arg);
            }else if(arg.name.endsWith("-convertor")){
                htmlFactory.equip(arg.bind, arg);
                console.log("register convertor:"+arg.bind);
            }else{
                Snapshot.cache(arg);
            }            
        }
        return this;
    }

    Snapshot.fn = Snapshot.prototype = {
        version: VERSION,
        constructor: Snapshot,
        config: { maxDepth:10, isVisible:true },
        init: function( options ){
            this.config = this.config||{};
            if( options ){
                this.config.isVisible = options.isVisible;
                this.config.convertType = options["convert-type"];
            }
            return this;
        }
    }    
    
    Snapshot.convert = function(){
        return htmlFactory.convert.apply(htmlFactory, arguments);
    };
    Snapshot.fn.convert = Snapshot.convert;
    
    global.Snapshot = Snapshot;

    if ( typeof define === "function" && define.amd ) {
        define( "Snapshot", [], function() {
            return Snapshot;
        } );
    }

    if(typeof module !== "undefined"){
        module.exports = Snapshot;
    }

})( typeof window !== "undefined" ? window : this, jQuery );

