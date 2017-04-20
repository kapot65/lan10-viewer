/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import 'jquery';
import 'jquery-ui';
import * as io from 'socket.io-client';
import * as uj from 'url-join';

class IndexDB {
    private host: string;
    private port: number;
    private pb_selector: string;
    private points: Array< {path: Array<string>, 
                            hist: Array<number>, 
                            bins: Array<number>} >
    
    constructor(pb_selector: string) { 
                
        this.pb_selector = pb_selector;
        this.host = $(this.pb_selector).data('host');
        
        if(this.host === '{{host}}')
            this.host = 'localhost';
        
        var port = $(this.pb_selector).data('port');
        if( port === '{{port}}') {
            this.port = 5555;
        } else {
            this.port = port;
        }
        
        var socket = io.connect(this.makeUrl());
        
        if(pb_selector) {
            socket.on('progress', function(data: {val: number}){
                $(pb_selector).progressbar("option", "value", data.val)
            });
        }
    };
    
    updatePoints() {
        $.getJSON((<any>uj).default(this.makeUrl(), 'files'), 
            function(data) {
            $(window).trigger('paths_updated', [data]);
        });
    }
    
    getHist(path: string, nodeId: number) {
        $.getJSON((<any>uj).default(this.makeUrl(), 'hist', path), 
            function(data) {
            if (typeof(data.error) !== 'undefined') {
                $(window).trigger('point_not_acquired', [nodeId]);
            } else {
                $(window).trigger('point_acquired', [data, path]);
            }
        });
    }
    
    getMeta(path: string) {
        
        $.getJSON((<any>uj).default(this.makeUrl(), 'meta', path), 
            function(data) {
            $(window).trigger('meta_acquired', [data, path]);
        });
    }
    
    private makeUrl() {
        return 'http://' + this.host + ':' + this.port;
    }
}

export { IndexDB };

