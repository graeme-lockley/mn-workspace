const FS = require("fs");
const Path = require("path");


function runTestsInDir(directory) {
    FS.readdirSync(directory).forEach(file => {
        const fileName = directory + Path.sep + file;

        FS.stat(fileName, (err, stat) => {
            if (stat.isFile()) {
                if (fileName.endsWith("Test.js")) {
                    require(fileName);
                }
            } else if (stat.isDirectory()) {
                runTestsInDir(fileName);
            }
        });
    });
}


runTestsInDir(__dirname);
