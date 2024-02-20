#!/bin/bash

TYPE=$1
PLATFORM=$2
FILE=$3
ROW=$3
COL=$4

function help_exit () {
    echo "Usage: npx find-in-source-map <type> <platform> <row|file> <col>"
    echo " "
    echo "- type: line, file"
    echo "- platform: android, ios"
    echo "- file: used with type 'file' to indicate the stack trace file path"
    echo "- row: number used with type 'line'"
    echo "- col: number used with type 'line'"
    echo " "
    echo "Example:"
    echo "npx find-in-source-map line ios 548 1052"
    echo "or"
    echo "npx find-in-source-map file android ./stack-trace.txt"
    exit 1
}

if [ "$PLATFORM" = "" ]; then
    help_exit
fi

if [ "$TYPE" = "line" ]; then
    if [ "$ROW" = "" ]; then
        help_exit
    fi
    if [ "$COL" = "" ]; then
        help_exit
    fi

    npx source-map resolve "./source-maps/main.$PLATFORM.js.map" "$ROW" "$COL"

elif [ "$TYPE" = "file" ]; then
    if [ "$FILE" = "" ]; then
        help_exit
    fi

    npx metro-symbolicate "./source-maps/main.$PLATFORM.js.map" < "$FILE"

else
    help_exit
fi
