#!/bin/bash
set -e

export HUSKY='true'

npx jest --ci --coverage

if [ "$1" == "--core" ]; then
  npm run validate-dependencies
fi
