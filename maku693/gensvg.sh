#!/bin/sh
for f in `ls -1 problems/*.problem`; do
  fname=${f##*/}
  echo "Generating ${fname}.svg"
  ./draw-p -o "images/${fname}.svg" -w 400 < "${f}"
done
