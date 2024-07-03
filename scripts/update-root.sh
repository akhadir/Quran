#!/bin/bash

for i in {4..100}
do
  echo 'Updating Sura, '$i;
  node ./scripts/update-root.js $i &
done