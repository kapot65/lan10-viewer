/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import $ = require("jquery");
import d3 = require("d3");
import Plotly = require("plotly.js")
//import chartjs = require("chartjs");


class Graph {
    message: string;
    constructor(selector: string) {
        this.message = selector;
    }
    
    drawGraph() {
        
    var data = [
        {
            x: [0, 1, 2],
            y: [20, 14, 23]
        }
    ];
    Plotly.newPlot('myDiv', data);
     
    /*   
        var svg = d3.select(this.message),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3.timeParse("%d-%b-%y");

        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var line = d3.line()
            .x(function(d: any) { return x(d.date); })
            .y(function(d: any) { return y(d.close); });

        d3.tsv("data.tsv", function(d: any) {
          d.date = parseTime(d.date);
          d.close = +d.close;
          return d;
        }, function(error, data) {
          if (error) throw error;

          x.domain(d3.extent(data, function(d: any) { return d.date; }));
          y.domain(d3.extent(data, function(d: any) { return d.close; }));

          g.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))
            .select(".domain")
              .remove();

          g.append("g")
              .call(d3.axisLeft(y))
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
        });*/
    }
    
    print() {
        d3.selectAll(this.message).style("color", "red");
    }
};

export { Graph };

/*
class B extends A {
    constructor(name: string) { super(name); }
    print() {
        console.log(this.message);
    }
};*/