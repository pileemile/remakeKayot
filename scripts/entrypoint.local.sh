#!/bin/bash

npm install

export NG_PERSISTENT_BUILD_CACHE=false
ng serve --host=0.0.0.0 --port ${FRONT_PORT} --poll 2000
