"""Lan10-12PCI points web viewer."""
from argparse import ArgumentParser
import base64
from glob import glob
from os import path
from threading import Lock

import dfparser
import eventlet
from flask import Flask
from flask import jsonify
from flask import render_template
from flask_cors import CORS
from flask_socketio import SocketIO
import numpy as np
from signal_utils.convert_utils import rsb_to_df
from signal_utils.extract_utils import extract_amps_approx2
from unqlite import UnQLite

APP = Flask(__name__, static_url_path='',
            static_folder='../public_html',
            template_folder='../public_html')
CORS(APP)
APP.config['SECRET_KEY'] = 'secret!'
SOCKETIO = SocketIO(APP)
LOCK = Lock()


@APP.route('/meta/<path:filepath>')
def get_meta(filepath):
    """Return file metadata."""
    fp_abs = path.join(ARGS.points_dir, filepath)

    if fp_abs.endswith('.rsb'):
        dataset = dfparser.RshPackage(fp_abs)
        meta = dataset.params

    elif fp_abs.endswith('.df'):
        _, meta, _ = dfparser.parse_from_file(fp_abs, nodata=True)

    return jsonify(meta)


@APP.route('/hist/<path:filepath>')
def get_hist(filepath):
    """Calculate file histogram."""
    if LOCK.locked():
        return jsonify({'error': 'busy'})

    with LOCK:
        SOCKETIO.emit('progress', {'val': 0})
        eventlet.sleep(0)

        if filepath not in DB:
            fp_abs = path.join(ARGS.points_dir, filepath)

            if fp_abs.endswith('.rsb'):
                meta, data = rsb_to_df({}, fp_abs)

            elif fp_abs.endswith('.df'):
                _, meta, data = dfparser.parse_from_file(fp_abs)

            events_all = process_point(meta, data)

            hist, bins = np.histogram(events_all, range=(0, 32768), bins=512)
            bins = (bins[:-1] + bins[1:])/2

            hist = np.trim_zeros(hist, 'b')
            bins = bins[:len(hist)]
            hist = np.trim_zeros(hist, 'f')
            bins = bins[len(bins) - len(hist):]

            with DB.transaction():
                hist_dec = base64.b85encode(hist.astype(np.int32).tobytes())\
                    .decode()
                bins_dec = base64.b85encode(bins.astype(np.float32).tobytes())\
                    .decode()

                DB[filepath] = {
                    'path': filepath,
                    'hist': hist_dec,
                    'bins': bins_dec
                }

        else:
            data = eval(DB[filepath])

            hist = np.frombuffer(base64.b85decode(data['hist']), np.int32)
            bins = np.frombuffer(base64.b85decode(data['bins']), np.float32)

        SOCKETIO.emit('progress', {'val': 100})
        return jsonify({'hist': [int(h) for h in hist],
                        'bins': [float(b) for b in bins]})


def parse_args():
    """Server argument parser."""
    parser = ArgumentParser(description='Lan10-12PCI data viewer server')

    parser.add_argument('--host', default='localhost',
                        help='server host (default - "localhost")')
    parser.add_argument('--port', type=int, default=5555,
                        help='server port (default - 5555)')

    path_ = 'points'
    parser.add_argument('--points-dir', default=path_,
                        help='path to directory with points '
                        '(default - "%s")' % (path_))

    db_file = 'DB.unqlite'
    parser.add_argument('--db-path', default=db_file,
                        help='path to cache database '
                        '(default - "%s")' % (db_file))

    return parser.parse_args()


@APP.route('/files')
def get_files():
    """Get files list."""
    files = glob(path.join(ARGS.points_dir, '**'), recursive=True)
    files_rel = [path.relpath(f, ARGS.points_dir).replace('\\', '/')
                 for f in files if not path.isdir(f)]

    return jsonify(files_rel)


@APP.route('/index.html')
def index():
    """Web-interface main page."""
    return render_template('index.html', host=ARGS.host, port=ARGS.port)


def process_point(meta, data):
    """Extract data from point file."""
    point = dfparser.Point()
    point.ParseFromString(data)

    sample_freq = meta['params']['sample_freq']
    threshold = meta['process_params']['threshold']

    events_all = []
    for channel in point.channels:
        for i, block in enumerate(channel.blocks):
            SOCKETIO.emit('progress',
                          {'val': int((i/len(channel.blocks))*100)})
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
    return events_all


if __name__ == '__main__':
    ARGS = parse_args()

    DB = UnQLite(ARGS.db_path)
    DB.begin()

    SOCKETIO.run(APP, port=ARGS.port, host=ARGS.host)
