#!/bin/sh

# tarballs.sh

# hgeometric: A geometric library with bindings to GPC.
# tarballs.sh is part of hgeometric.

# Copyright 2007, 2009 Marco Túlio Gontijo e Silva
# Copyright 2007 Rafael Cunha de Almeida
# See LICENSE

set -e

echo Comparing tarballs...
darcs dist
./Setup.hs sdist
mkdir temp
cd temp
tar xzf ../hgeometric.tar.gz
tar xzf ../dist/hgeometric-0.0.1.tar.gz
diff -ruN hgeometric hgeometric-0.0.1
if [ `diff -ruN hgeometric hgeometric-0.0.1` = "" ]
then
    cd ..
    rm -r temp hgeometric.tar.gz dist/hgeometric-0.0.1.tar.gz
    echo ok
    exit 0
else
    cd ..
    rm -r hgeometric.tar.gz dist/hgeometric-0.0.1.tar.gz
    echo FAIL!
    exit -1
fi
