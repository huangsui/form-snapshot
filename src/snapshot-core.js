

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
    const HtmlFactory = require('./convert/note-convert.js');
    const Util = require('./common/util.js');
    const Cache = require('./common/cache.js');
    const Noter = require('./core/noter.js');

    var that = this;
    var htmlFactory = new HtmlFactory();
    var aCache = new Cache();
    var noter = new Noter();

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

    var Snapshot = function( options ) {
        this.init( options );
        this.takeSnap = function( selector, opts ){
            var node = $(selector)[0];
            return noter.takeNote(node);
        };
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
                noter.registerProcessor(arg);
                if(typeof arg.convert === "function"){
                    htmlFactory.equip(arg);
                }
            }else if(arg.name.indexOf("-filter")>0){
                noter.registerFilter(arg);
            }else if(arg.name.indexOf("-convertor")>0){
                htmlFactory.equip(arg.bind, arg);
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

