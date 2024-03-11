#!/bin/bash

PLATFORM=$1

function help_exit () {
    echo "Usage: npx generate-source-map <platform>"
    echo " "
    echo "- platform: android, ios"
    echo " "
    echo "Example:"
    echo "npx generate-source-map android"
    echo "or"
    echo "npx generate-source-map ios"
    exit 1
}

if [ "$PLATFORM" = "" ]; then
    help_exit
fi

mkdir "./source-maps"
mkdir "./source-maps/$PLATFORM"

npx react-native bundle --platform "$PLATFORM" \
    --entry-file index.js \
    --dev false \
    --bundle-output "./source-maps/main.$PLATFORM.jsbundle" \
    --assets-dest "./source-maps/$PLATFORM/" \
    --sourcemap-output "./source-maps/main.$PLATFORM.js.map"
