/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

import $ from 'jquery';
import Plotly = require("plotly.js");
import d3 = require("d3");


class Graph {
    selector: string;
    svg_jq: any;
    svg_id: string;
    x: any;
    y: any;
    svg: any;
    margin: any;
    width: number;
    height: number;
    
    constructor(selector: string) {
        
        this.selector = selector;
        this.svg_id = "graph_svg";
        /*
        this.svg = d3.select(this.selector)
            .append("div")
            .classed("svg-container", true) //container class to make it responsive
            .append("svg")
            //responsive SVG needs these 2 attributes and no width and height attr
            //.attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 600 400")
            //class to make it responsive
            .attr("id", this.svg_id)
            .classed("svg-content-responsive", true);
            
        this.svg_jq = $("#" + this.svg_id);
        this.margin = {top: 20, right: 20, bottom: 30, left: 50};*/
        var s = $(this.selector);
        s.on('resize', this.replot);
    };
    
    replot() {
        alert(111);
        this.width = +this.svg_jq.outerWidth() - this.margin.left 
                     - this.margin.right,
        this.height = +this.svg_jq.outerHeight() - this.margin.top 
                      - this.margin.bottom;
                      
        this.x = d3.scaleTime()
            .rangeRound([0, this.width]);

        this.y = d3.scaleLinear()
            .rangeRound([this.height, 0]);
            
        var update = {
            width: 800,  // or any new width
            height: 500  // " "
          };

        Plotly.relayout('myDiv', update);
                       
    };
    
    drawGraph() {
        
        var plot = Plotly.newPlot("myDiv", [{
            x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
            y: [1, 3, 6]//,
            //type: 'scatter'
        }]);
        
        
        /*
        var g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        var parseTime = d3.timeParse("%d-%b-%y");

        this.replot();

        var line = d3.line()
            .x(function(d: any) { return this.x(d.date); }.bind(this))
            .y(function(d: any) { return this.y(d.close); }.bind(this));

        var set_data = function(error: any, data: any) {
          if (error) throw error;

          this.x.domain(d3.extent(data, function (d: any) {return d.date;}.bind(this)));
          this.y.domain(d3.extent(data, function(d: any) { return d.close; }.bind(this)));

          g.append("g")
              .attr("transform", "translate(0," + this.height + ")")
              .call(d3.axisBottom(this.x))
            .select(".domain")
              .remove();

          g.append("g")
              .call(d3.axisLeft(this.y))
            .append("text")
              .attr("fill", "#000")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
              .text("Price ($)");

          g.append("path")
              .datum(data)
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("stroke-width", 1.5)
              .attr("d", line);
        }.bind(this);

        d3.tsv("data.tsv", function(d: any) {
          d.date = parseTime(d.date);
          d.close = +d.close;
          return d;
        }, set_data);
        */
    };
    
    print() {
        d3.selectAll(this.selector).style("color", "red");
    };
};

export { Graph };

/*
class B extends A {
    constructor(name: string) { super(name); }
    print() {
        console.log(this.message);
    }
};*/