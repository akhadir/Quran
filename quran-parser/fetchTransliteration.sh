#!/bin/sh
doFetch=true
start=4
end=114
while [ $start -le $end ]
do
  echo "Fetching Chapter "$start;
  node ./src/transliteration.ts $start;
  start=$((start+1));
done
echo "Completed Transliteration"