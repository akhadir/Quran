#!/bin/sh
doFetch=true
start=9
end=114
while [ $start -le $end ]
do
  echo "Fetching Chapter "$start;
  node ./src/rootword.ts $start;
  start=$((start+1));
done
echo "Completed English"