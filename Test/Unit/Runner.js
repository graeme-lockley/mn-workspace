const Path = require("path");

const String = require("../../Data/String").String;
const FileSystem = require("../../Native/System/IO/FileSystem");


function run(base) {
    return options => {
        options.filter = options.filter
            ? options.filter
            : filename => true;

        function runTestsInDir(directory) {
            FileSystem.readdir(directory)
                .then(files =>
                    files.forEach(file => {
                        const fileName = directory + Path.sep + file;

                        FileSystem.stat(fileName)
                            .then(stat => {
                                if (stat.isFile()) {
                                    if (options.filter(String.of(fileName))) {
                                        require(fileName);
                                    }
                                } else if (stat.isDirectory()) {
                                    runTestsInDir(fileName);
                                }
                            });
                    })
                );
        }

        runTestsInDir(base.content);
    };
}


module.exports = run;
