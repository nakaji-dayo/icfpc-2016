import os
import sys
import time
import requests

from datetime import datetime

API_KEY = '269-cc89c7ed9c8956efa599df57dd992fb1'
LIST_URL = 'http://2016sv.icfpcontest.org/api/snapshot/list'
BLOB_URL = 'http://2016sv.icfpcontest.org/api/blob/'

MAX_FETCH = 300

def get(url, raw=False):
    h = {'X-API-Key': API_KEY}
    r = requests.get(url, headers=h)
    if not r.status_code == 200:
        raise RuntimeError("url: %s, status_code: %s, body: %s" %(url, r.status_code, r.content))

    if raw:
        return r.content

    return r.json()


def current_unixtime():
    t = datetime.strptime(time.strftime('%Y%m%d %H'), '%Y%m%d %H')
    return t.strftime('%s')


def main():
    list_results = get(LIST_URL)
    if 'snapshots' not in list_results:
        return

    c_unix = current_unixtime()
    current_hash = [x['snapshot_hash'] for x in list_results['snapshots'] if x['snapshot_time'] == int(c_unix)]
    if not len(current_hash) > 0:
        return
    current_hash = current_hash[0]

    time.sleep(1)
    current_stats = get(BLOB_URL + current_hash)
    hash_list = {x['problem_id']:x['problem_spec_hash'] for x in current_stats['problems']}
    if not os.path.exists('problems'):
        os.mkdir('problems')

    counter = 0
    for k, v in hash_list.items():
        filename = "problems/%s.problem" % (k)
        if os.path.exists(filename):
            continue

        counter += 1
        if counter > MAX_FETCH:
            break

        time.sleep(1)
        blob = get(BLOB_URL + str(v), True)
        with open(filename, 'w') as f:
            f.write(blob)
        print "OK: %s" % k

if __name__ == '__main__':
    main()
