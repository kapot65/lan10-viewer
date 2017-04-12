/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

import 'jquery';
import Plotly = require("plotly.js");
import d3 = require("d3");

class Graph {
    
    protected static id: number = 0;
    private plot_id: string;
    private selector: string;
    private margin: any;
    private width: number;
    private height: number;
    private traces: any;
    
    constructor(selector: string) {

        this.selector = selector;
        
        this.plot_id = "plot_" + Graph.id;
        Graph.id += 1;
        
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};
        
        d3.select(this.selector).append('div').attr('id', this.plot_id)
        .style('width', '100%')
        .style('height', '100%');
      
        this.bindResizeEvent();
        
        var numbers = []
        for (let i = 0, max = 100; i < max; i++) {
            numbers[numbers.length] = Math.random();
        }
        
        
        this.traces = [{
            y: numbers,
            type: 'bar',
            marker: {
                color: 'blue',
            },
            legend: ""
        }]
        
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
    
    protected changeData() {
        Plotly.newPlot(this.plot_id, this.traces);
    };
};

export { Graph };