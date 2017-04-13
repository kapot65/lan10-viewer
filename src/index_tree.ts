/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import 'jquery';
import 'bootstrap-treeview';
import {IndexDB} from  './index_db'

interface PathNode {
    text: string,
    nodes?: PathNode[],
    collapseIcon?: string,
    expandIcon?: string,
    state?: any,
    tags?: string[],
    selectable?: boolean,
    path?: string,
};

class IndexTree {
    private selector: string;
    private index_db: IndexDB;
    private tree: PathNode[] = [];
    
    constructor(selector: string, index_db: IndexDB) {
        this.selector = selector;
        this.index_db = index_db;
        
        var points = index_db.getPoints();
        this.pathsToTree(points);
        
        $(selector).treeview({
            data: this.tree,
            collapseIcon: "glyphicon glyphicon-folder-open",
            expandIcon: "glyphicon glyphicon-folder-close",
            multiSelect: true
        });
        
        $(selector).on('nodeSelected', function(event, data) {
            
            if (typeof (data.path) !== "undefined") {
                $(window).trigger('point_selected', [data.path]);
            }

        });
        
        $(selector).on('nodeUnselected', function(event, data) {
            if (typeof (data.path) !== "undefined") {
                $(window).trigger('point_unselected', [data.path]);
            }
        });
        
    }
    
    protected addFileToTree(path: string) {
        var chain = path.split("/");
        var currentNode = this.tree;
        for (var j = 0; j < chain.length; j++) {
            var wantedNode = chain[j];

            var lastNode = currentNode;
            for (var k = 0; k < currentNode.length; k++) {

                if (currentNode[k].text == wantedNode) {
                    currentNode = currentNode[k].nodes;
                    break;
                }
            }
            // If we couldn't find an item in this list of children
            // that has the right name, create one:
            if (lastNode == currentNode) {
                
                var newNode;
                
                if ( j == chain.length - 1) {
                    newNode = currentNode[k] = { 
                        text: wantedNode,
                        path: path
                    }
                    
                } else {
                    newNode = currentNode[k] = { text: wantedNode,
                        selectable: false,
                        nodes: []
                    };
                    
                    currentNode = newNode.nodes;
                }
            }
        }
    }
    
    protected pathsToTree(paths: Array<string>) {
        for (let path of paths) {
            this.addFileToTree(path);
        }
    }
}

export { IndexTree };