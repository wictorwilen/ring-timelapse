#!/bin/sh

crond -L /var/log/cron.log && tail -f /var/log/cron.log