# -*- coding: utf-8 -*-
import sys
import base64
from os import path
from glob import glob
from argparse import ArgumentParser

import dfparser
import eventlet
import numpy as np
from flask import Flask, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO
from unqlite import UnQLite

utils_dir = path.join(path.dirname(path.realpath(__file__)),
                      'counter-redirecter/utils')
if not utils_dir in sys.path: sys.path.append(utils_dir)
del utils_dir

import rsb_event_pb2
from rsb import rsb_to_df
from signal_utils.extract_utils import extract_amps_approx2

app = Flask(__name__, static_url_path='', 
            static_folder='../public_html',
            template_folder='../public_html')
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/meta/<path:fp>')
def meta(fp):
    
    fp_abs = path.join(args.points_dir, fp)
    
    if fp_abs.endswith('.rsb'):
        ds = dfparser.RshPackage(fp_abs)
        meta = ds.params
        
    elif fp_abs.endswith('.df'):
        _, meta, _ = dfparser.parse_from_file(fp_abs, nodata=True)
        
    return jsonify(meta)

    
@app.route('/hist/<path:fp>')
def hist(fp):
    
    socketio.emit('progress', {'val': 0})
    eventlet.sleep(0)
    
    if not fp in db:
        
        fp_abs = path.join(args.points_dir, fp)
        
        if fp_abs.endswith('.rsb'):
            meta, data = rsb_to_df({},fp_abs)
        
        elif fp_abs.endswith('.df'):
            header, meta, data = dfparser.parse_from_file(fp_abs)
            
        p = rsb_event_pb2.Point()
        p.ParseFromString(data)
        
        sample_freq = meta['params']['sample_freq']
        threshold = meta['process_params']['threshold']
        
        events_all = []
        for ch in p.channels:
            for i, block in enumerate(ch.blocks):
                socketio.emit('progress', {'val': int((i/len(ch.blocks))*100)})
                eventlet.sleep(0)
                events = []
                for event in block.events:
                    data = np.frombuffer(event.data, np.int16)
                    events.append(extract_amps_approx2(data, event.time, 
                                                       threshold, 
                                                       sample_freq)[0])
                events = np.hstack(events)[0::2]
                events_all.append(events)
                
        events_all = np.hstack(events_all)
        hist, bins = np.histogram(events_all, 120)
        
        
        with db.transaction():
            db[fp] = {'path': fp, 
                      'hist': base64.b85encode(hist.astype(np.int32)
                              .tobytes()).decode(),
                      'bins': base64.b85encode(bins.astype(np.float32)
                              .tobytes()).decode()
                      }
        
    else:
        data = eval(db[fp])
        
        hist = np.frombuffer(base64.b85decode(data['hist']), np.int32)
        bins = np.frombuffer(base64.b85decode(data['bins']), np.float32)
    
    socketio.emit('progress', {'val': 100})
    return jsonify({'hist': [int(h) for h in hist], 
                    'bins': [float(b) for b in bins]})


def parse_args(): 
    parser = ArgumentParser(description='Lan10-12PCI data viewer server')

    parser.add_argument('--host', default='localhost',
                        help='server host (default - "localhost")')
    parser.add_argument('--port', type=int, default=5555,
                        help='server port (default - 5555)')
    
    path_ = 'points'
    parser.add_argument('--points-dir', default=path_,
                        help='path to directory with points '
                        '(default - "%s")'%(path_))
    
    db_file = 'db.unqlite'
    parser.add_argument('--db-path', default=db_file,
                        help='path to cache database '
                        '(default - "%s")'%(db_file))
    
    return parser.parse_args()


@app.route('/files')
def files():
    
    files = glob(path.join(args.points_dir, '**'), recursive=True)
    files_rel = [path.relpath(f, args.points_dir).replace('\\', '/') 
                 for f in files if not path.isdir(f)]
    
    return jsonify(files_rel)


@app.route('/index.html')
def index():
    return render_template('index.html', host=args.host, port=args.port)


if __name__ == '__main__':
    args = parse_args();
    
    db = UnQLite(args.db_path)
    db.begin()
    
    socketio.run(app, port=args.port, host=args.host)