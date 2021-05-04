// Copyright (c) Wictor Wilén. All rights reserved. 
// Licensed under the MIT license.

import { writeFileSync, rmSync, existsSync, readdirSync, lstatSync } from 'fs';
import * as path from 'path'
import FfmpegCommand from 'fluent-ffmpeg';

async function timelapse() {

    const folders = readdirSync(path.resolve(__dirname, "target"));
    folders.forEach(f => {
        if (lstatSync(path.resolve(__dirname, "target", f)).isDirectory()) {
            console.log(f);

            let command = FfmpegCommand();

            const files = readdirSync(path.resolve(__dirname, "target", f));
            let template = "";
            const templateFilePath = path.resolve(__dirname, "target", f + "-" + Date.now() + '.txt');


            command.on('error', (err) => {
                console.log('An error occurred: ' + err.message);
            });

            // Cleanup commands once timelapse is done
            command.on('end', () => {
                console.log('Merging finished, removing snapshot images!');
                for (const file of files) {
                    rmSync(path.resolve(__dirname, "target", f, file));
                }
                rmSync(templateFilePath);
                console.log("Done!");
            });

            // add all the image files
            for (const file of files.sort((a, b) => {
                return lstatSync(path.resolve(__dirname, "target", f, a)).mtimeMs -
                    lstatSync(path.resolve(__dirname, "target", f, b)).mtimeMs;
            })) {
                console.log(`Adding ${file}`);
                template += `file ${path.resolve(__dirname, "target", f, file)}\n`;
            }

            // add the last file on additional time
            template += `file ${path.resolve(__dirname, "target", f, files[files.length - 1])}\n`;
            
            // write the template file to disk
            writeFileSync(templateFilePath, template);

            // configure ffmpeg
            command.fpsOutput(24);
            command.addInput(templateFilePath);
            command.inputOptions(["-f", "concat", "-safe", "0"])
            command.videoCodec("libx264")
            command.noAudio()
            command.format("mp4");

            // persist the file
            command.save(path.resolve(__dirname, "target", f + "-" + Date.now() + '.mp4'));
        }
    });

}

timelapse();

