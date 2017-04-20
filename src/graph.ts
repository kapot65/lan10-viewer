/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

import 'jquery';
import 'randomColor'
import 'plotly.js'
interface PlotlyStatic {
    relayout(root: string, update: {}): void;
    newPlot(root: string, traces: {}[], layout: {}): void;
}
declare var Plotly: PlotlyStatic;

import d3 = require("d3");
import {IndexDB} from  './index_db'
import {md5} from './md5';

class Graph {
    
    protected static id: number = 0;
    private plot_id: string;
    private selector: string;
    private width: number;
    private height: number;
    private traces: any = [];
    private index_db: IndexDB;
    private layout: {} = { barmode: "overlay" };
    
    constructor(selector: string, index_db: IndexDB) {
        this.selector = selector;
        this.index_db = index_db;
        
        this.plot_id = "plot_" + Graph.id;
        Graph.id += 1;
        
        d3.select(this.selector).append('div').attr('id', this.plot_id)
        .style('width', '100%')
        .style('height', '100%');
      
        this.bindResizeEvent();
        
        var numbers = []
        for (let i = 0, max = 100; i < max; i++) {
            numbers[numbers.length] = Math.random();
        }
        
        $(window).on('redraw_colors', this.colorIds.bind(this))
        $(window).on('point_selected', this.request_point.bind(this));
        $(window).on('point_unselected', this.unplot_point.bind(this))
        $(window).on('point_acquired', this.plot_point.bind(this))
        
        this.changeData();
    };
    
    replot() {
        this.width = +$(this.selector).width() 
        this.height = +$(this.selector).height()
        
        $('#' + this.plot_id).width(this.width);
        $('#' + this.plot_id).height(this.height);

        var update = {
            width: this.width,
            height: this.height
        };

        Plotly.relayout(this.plot_id, update);              
    };
    
    protected request_point(event: any, path: string, nodeId: number) {
        this.index_db.getHist(path, nodeId);
    }
    
    protected plot_point(event: any, 
                         hist: {bins: number[], 
                                hist: number[]},
                         path: string) {
                                         
        var color = randomColor();
        this.traces[this.traces.length] = {
            y: hist.hist,
            x: hist.bins,
            type: 'bar',
            opacity: 0.7,
            coloring: 'lines',
            marker: {
                color: color
            },
            label: path,
            name: path
        }
        this.changeData();
    }
    
    protected unplot_point(event: any, path: string) {
        
        var to_delete: any = [];
        for (let key in this.traces) {
            if ( this.traces[key].label == path) {
                to_delete[to_delete.length] = Number(key);
            }
        }
        
        for (var i = to_delete.length -1; i >= 0; i--)
            this.traces.splice(to_delete[i], 1);
            
        this.changeData();
    }
    
    protected bindResizeEvent() {
        
        $(this.selector + " > div.ui-resizable-handle").mousedown( 
            function () {
                //$('#' + this.plot_id).hide();
            }.bind(this));
        
        $(this.selector + " > div.ui-resizable-handle").mouseup( 
            function () {
                //$('#' + this.plot_id).show();
                this.replot();
            }.bind(this));
            
    };
    
    protected colorIds() {
        setTimeout(function() {
            for (let params of this.traces) {
                $('#' + md5(params.label)).css('background-color',  
                params.marker.color);
            }
        }.bind(this), 50)
    }
    
    protected changeData() {
        Plotly.newPlot(this.plot_id, (this.traces), this.layout);
        $(window).trigger('redraw_colors')
    };
};

export { Graph };