#!/bin/bash

for i in {5..40}
do
  echo 'Updating Sura, '$i;
  node ./scripts/update-root.js $i &
done