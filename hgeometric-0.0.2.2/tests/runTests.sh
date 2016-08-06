#!/bin/sh

# runTests.sh

# hgeometric: A geometric library with bindings to GPC.
# runTests.sh is part of hgeometric.

# Copyright 2007, 2009 Marco Túlio Gontijo e Silva
# See LICENSE

set -e

c2hs Algebra/Geometric/Strip.chs
c2hs Algebra/Geometric/Polygon.chs
c2hs Algebra/Geometric/Polygon/File.chs
c2hs Algebra/Geometric/Contour.chs
c2hs Algebra/Geometric/Clip.chs
runhaskell -Wall -Werror -fffi -lgpcl tests/Tests.hs
