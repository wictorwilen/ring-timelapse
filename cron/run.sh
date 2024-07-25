#!/bin/sh

# Setup the cron job
echo "$CRON_SCHEDULE cd /app && npm run snapshot" >> /etc/crontabs/root
echo "$CRON_SCHEDULE_TIMELAPSE cd /app && npm run timelapse" >> /etc/crontabs/root

crond -L /var/log/cron.log && tail -f /var/log/cron.log

