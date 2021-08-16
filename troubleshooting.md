# Troubleshooting tips

## Check the logs of the Docker container

Use `docker container logs <container-id>` to show the logs of the Docker container

## Run the snapshots manually

Start the interactive shell of the Docker container using `docker exec -it <container-id> sh` and the run either `npm run snapshot` or `npm run timelapse`.

