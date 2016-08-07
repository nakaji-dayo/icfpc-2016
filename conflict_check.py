import os
import hashlib

from collections import OrderedDict


def getfiles(path):
    files = []
    for item in os.listdir(path):
        filepath = os.path.join(path, item)
        if not os.path.isdir(filepath):
            files.append(filepath)

    return files


def md5(filename):
    with open(filename, "rb") as f:
        data = f.read()
        return hashlib.md5(data).hexdigest()


def main(path):
    analysis = {}
    for x in getfiles(path):
        mdhash = md5(x)
        if mdhash not in analysis.keys():
            analysis[mdhash] = []

        analysis[mdhash].append(os.path.basename(x))

    c = OrderedDict(sorted(analysis.items(), key=lambda x:len(x[1]), reverse=True))

    for x in c.values():
        gohan = sorted(x)
        print len(gohan)
        print "cd ~/Dropbox/ICFPC2016/results/"
        print "for x in %s" % " ".join([x.split('.')[0] for x in gohan])
        print "do"
        print "test -f ~/Dropbox/ICFPC2016/results/results_$x || sleep 2"
        print "test -f ~/Dropbox/ICFPC2016/results/results_$x || cat ../solutions/%s.solution | python icfp.py solution $x" % gohan[0].split('.')[0]
        print "done"
        print "====================================="


if __name__ == '__main__':
    main('Dropbox/ICFPC2016/problems/')
