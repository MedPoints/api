#!/usr/bin/env bash

export NODE_ENV=production
node $@ 2>&1 | ./node_modules/.bin/bunyan --color
exit ${PIPESTATUS[0]}