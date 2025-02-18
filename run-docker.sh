#!/bin/bash
set -a
source .env.prod
set +a

sudo -E docker-compose -f docker-compose.prod.yml down
sudo -E docker-compose -f docker-compose.prod.yml up -d --build 