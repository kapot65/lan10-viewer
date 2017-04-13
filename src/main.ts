/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import {Graph} from './graph';
import {IndexTree} from './index_tree'
import {IndexDB} from  './index_db'

let index_db = new IndexDB();
let graph = new Graph("#draggable", index_db);
let index_tree = new IndexTree("#index_tree", index_db);

