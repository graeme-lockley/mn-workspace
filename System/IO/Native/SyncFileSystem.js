const FS = require("fs");
const Maybe = require("../../../Data/Native/Maybe");
const Result = require("../../../Data/Native/Result");


const stat = fileName => {
    try {
        return Maybe.Just(FS.statSync(fileName));
    } catch (e) {
        return Maybe.Nothing;
    }
};


const exists = name =>
    FS.existsSync(name);


const fileExists = fileName =>
    stat(fileName).map(x => x.isFile()).reduce(() => false)(x => x);


const readFile = fileName => {
    try {
        return Result.Okay(FS.readFileSync(fileName, {encoding: "utf8"}));
    } catch (e) {
        return Result.Error(e.toString());
    }
};


const writeFile = fileName => content => {
    try {
        return Result.Okay(FS.writeFileSync(fileName, content));
    } catch (e) {
        return Result.Error(e.toString());
    }
};


module.exports = {
    exists,
    fileExists,
    readFile,
    stat,
    writeFile
};