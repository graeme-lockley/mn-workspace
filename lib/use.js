const Path = require("path");
const mrequire = require("./mrequire");

const SyncFileSystem = mrequire("core:System.IO.Native.SyncFileSystem:1.0.0");


const ascii0 =
    "0".charCodeAt(0);


const ascii9 =
    "9".charCodeAt(0);


const isDigit = ch =>
    (ch >= ascii0 && ch <= ascii9);


const extractVersion = fileName => fromIndex => {
    let lp = fromIndex;
    let startIndex = lp;

    while (true) {
        while (lp >= 0 && isDigit(fileName.charCodeAt(lp))) {
            lp -= 1;
        }

        if (lp >= 0 && fileName.charCodeAt(lp) === ".".charCodeAt(0)) {
            startIndex = lp;
            lp -= 1;
        } else {
            return fileName.substr(startIndex, fromIndex - startIndex);
        }
    }
};


const splitFileName = fileName => {
    const extension = Path.extname(fileName);
    const version = extractVersion(fileName)(fileName.length - extension.length);

    return {
        name: fileName.substr(0, fileName.length - extension.length - version.length),
        version: version,
        extension: extension
    };
};


const use2 = compile => fileName => {
    const fullFileName = Path.isAbsolute(fileName)
        ? fileName
        : Path.join(process.cwd(), fileName);

    const splitName = splitFileName(fullFileName);
    const targetName = splitName.name + ".js";


    const modificationDate = fileName =>
        SyncFileSystem.stat(fileName).map(s => s.mtime);


    const hasTarget = () =>
        SyncFileSystem.fileExists(targetName);


    const targetOlderThanSource = () => {
        const sourceDateTime = modificationDate(fullFileName);
        const targetDateTime = modificationDate(targetName);

        return sourceDateTime.map(t => t.getTime()).reduce(() => 0)(v => v) >= targetDateTime.map(t => t.getTime()).reduce(() => 0)(v => v);
    };

    if (!hasTarget() || targetOlderThanSource()) {
        console.log(`Compiling ${fullFileName}`);
        const result = compile(fullFileName)(targetName);
        if (result.isError()) {
            throw new Error(result.toString());
        }
    }

    return require(targetName);
};


const use = fileName => {
    if (fileName.endsWith(".js")) {
        return require(fileName);
    } else {
        const split = splitFileName(fileName);

        return (split.version === "")
            ? use2(require(`../Tool/${split.extension.substr(1)}/Use`))(fileName)
            : use2(mrequire(`core:Tool.${split.extension.substr(1)}:${split.version.substr(1)}`))(fileName);
    }
};


module.exports = use;