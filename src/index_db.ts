/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import 'jquery';
import 'jquery-ui';
import * as io from 'socket.io-client';
import 'url-join';
 
 var testPaths: string[] = [
    'test_session/test_group/set_1/point1.df',
    'test_session/test_group/set_1/point2.df',
    'test_session/test_group/set_1/point3.df',
    'test_session/test_group/set_2/point1.df',
    'test_session/test_group/set_2/point4.df',
    'test_session/test_group2/set_1/point6.df',
    'test_session/test_group2/set_1/point3.df',
 ]
 
var testHist: { [key:string]:{ hist: number[], bins: number[] }; } = {};
for (let path of testPaths) {
    var hist: number[] = [];
    var bins: number[] = [];
    
    for (let i = 0; i < 100; i++) {
        hist[i] = Math.random();
        bins[i] = i;    
    }
    
    testHist[path] = {
        hist: hist,
        bins: bins
    }
}
 
var testMeta: { [key:string]:{}; } = {
    'test_session/test_group/set_1/point1.df': {
        meta: "Meta"
    },
    'test_session/test_group/set_1/point2.df': {
        meta: "Meta"
    },
    'test_session/test_group/set_1/point3.df': {
        meta: "Meta"
    },
    'test_session/test_group/set_2/point1.df': {
        meta: "Meta"
    },
    'test_session/test_group/set_2/point4.df': {
        meta: "Meta"
    },
    'test_session/test_group2/set_1/point6.df': {
        meta: "Meta"
    },
    'test_session/test_group2/set_1/point3.df': {
        meta: "Meta"
    }
}
 
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
        $.getJSON(urljoin(this.makeUrl(), 'files'), function(data) {
            $(window).trigger('paths_updated', [data]);
        });
    }
    
    getHist(path: string) {
        $.getJSON(urljoin(this.makeUrl(), 'hist', path), function(data) {
            $(window).trigger('point_acquired', [data, path]);
        });
    }
    
    getMeta(path: string) {
        
        $.getJSON(urljoin(this.makeUrl(), 'meta', path), function(data) {
            $(window).trigger('meta_acquired', [data, path]);
        });
    }
    
    private makeUrl() {
        return 'http://' + this.host + ':' + this.port;
    }
}

export { IndexDB };

