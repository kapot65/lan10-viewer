/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import 'jquery';
import 'bootstrap-treeview';

class IndexTree {
    constructor(selector: string) {
        
        var tree = [
            {
              text: "Parent 1",
              nodes: [
                {
                  text: "Child 1",
                  nodes: [
                    {
                      text: "Grandchild 1"
                    },
                    {
                      text: "Grandchild 2"
                    }
                  ]
                },
                {
                  text: "Child 2"
                }
              ]
            },
            {
              text: "Parent 2"
            },
            {
              text: "Parent 3"
            },
            {
              text: "Parent 4"
            },
            {
              text: "Parent 5"
            }
          ];
        
        $(selector).treeview({data: tree});
    
        $(selector).on('nodeSelected', function(event, data) {
            alert(JSON.stringify(data));
        });

    }
}

export { IndexTree };