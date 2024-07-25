FROM node:20.10 AS BUILD_IMAGE

RUN curl -sf https://gobinaries.com/tj/node-prune | sh

WORKDIR /work

COPY package.json /work/
COPY tsconfig.json /work/
COPY src/ /work/src

RUN npm install 
RUN npm run build
RUN npm prune --production
RUN /usr/local/bin/node-prune

FROM node:20.10-alpine

RUN apk add --no-cache ffmpeg

ENV TOKEN=$TOKEN 
ENV CRON_SCHEDULE="*/15 * * * *"
ENV CRON_SCHEDULE_TIMELAPSE="0 7 * * *"

WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /work/dist ./dist
COPY --from=BUILD_IMAGE /work/node_modules ./node_modules
COPY --from=BUILD_IMAGE /work/package.json .

# Create the cron log
RUN touch /var/log/cron.log

# Setup our start file
COPY ./cron/run.sh /tmp/run.sh
RUN chmod +x /tmp/run.sh 

CMD ["/tmp/run.sh"]
