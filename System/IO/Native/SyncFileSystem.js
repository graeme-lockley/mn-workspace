const FS = require("fs");

const Maybe = mrequire("core:Data.Native.Maybe:1.1.0");
const Result = mrequire("core:Data.Native.Result:1.0.0");


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