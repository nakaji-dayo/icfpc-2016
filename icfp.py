#!/usr/bin/env python
import os
import sys
import time
import json

from datetime import datetime, timedelta


def post(url, column, b):
    filename = time.strftime('%s') + '_postfile'
    with open(filename, 'w') as f:
        f.write(b)

    cmd = "curl -s --compressed -L -H 'Expect:' -H 'X-API-Key: 269-cc89c7ed9c8956efa599df57dd992fb1' -F 'solution_spec=@%s' -F '%s' %s > results_%s" % (filename, column, url, filename)
    os.system(cmd)
    result_file = "results_%s" % filename
    with open(result_file) as f:
        results = json.load(f)

    os.system('rm -f %s %s' % (filename, result_file))

    print results


def post_problem(b):
    url = 'http://2016sv.icfpcontest.org/api/problem/submit'
    publish_time = datetime.strptime(time.strftime('%Y%m%d %H'), '%Y%m%d %H')
    publish_time = publish_time + timedelta(hours=1)

    column = "publish_time=%s" % publish_time.strftime('%s')
    return post(url, column, b)


def post_solution(b, num):
    url = 'http://2016sv.icfpcontest.org/api/solution/submit'
    column = "problem_id=%s" % str(publish_time)
    return post(url, column, b)


def main(case, b, number=0):
    res = True
    if case == 'problem':
        post_problem(b)
    elif case == 'solution':
        post_solution(b, number)


def usage():
    print "post.py problem filename or cat filename | post.py problem"
    sys.exit(0)


if __name__ == '__main__':
    argv = sys.argv

    if not len(argv) > 1:
        usage()

    case = argv[1]
    if case == 'problem':
        b = sys.stdin.read()
        res = post_problem(b)
    elif case == 'solution':
        b = sys.stdin.read()
        number = argv[2]
        res = post_solution(b, number)
    else:
        usage()
