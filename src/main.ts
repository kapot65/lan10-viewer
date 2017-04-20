/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import 'jquery';
import 'bootstrap'

import {Graph} from './graph';
import {IndexTree} from './index_tree'
import {IndexDB} from  './index_db'
import {MetaView} from  './meta_view'

$( "#plot" ).resizable();
$( "#plot" ).draggable({containment: "parent"});
$( "#plot" ).selectable();
$( "#db_view" ).progressbar();

let index_db = new IndexDB("#db_view");
let graph = new Graph("#plot", index_db);
let index_tree = new IndexTree("#index_tree", index_db);
let meta_view = new MetaView("#jsonview", index_db);

