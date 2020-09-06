#!/bin/sh
doFetch=true
start=11
end=114
while [ $start -le $end ]
do
  echo "Fetching Chapter "$start;
  node ./src/english.ts $start;
  start=$((start+1));
done
echo "Completed English"