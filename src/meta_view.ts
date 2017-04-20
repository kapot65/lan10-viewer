import 'jquery';
import {IndexDB} from  './index_db'
import {md5} from './md5';

class MetaView {
    
    private selector: string;
    private index_db: IndexDB;
    
    constructor(selector: string, index_db: IndexDB) {
        
        this.selector = selector;
        this.index_db = index_db;

        $(window).on('point_selected', this.request_point_meta.bind(this));
        $(window).on('meta_acquired', this.show_meta.bind(this));
        
    }
    
    protected request_point_meta(event: any, path: string) {
        this.index_db.getMeta(path);
    }
    
    protected show_meta(event: any, meta: {}, data: string) {
        (<any>$)(this.selector).JSONView(meta, {collapsed: true});
    }
}

export { MetaView };
