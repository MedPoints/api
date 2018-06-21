#!/usr/bin/env bash

node app.js | ./node_modules/.bin/bunyan --color
exit ${PIPESTATUS[0]}
