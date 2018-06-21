#!/usr/bin/env bash

export NODE_ENV=production
node app.js | ./node_modules/.bin/bunyan --color
exit ${PIPESTATUS[0]}
