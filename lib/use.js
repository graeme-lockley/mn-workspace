const Path = require("path");
const mrequire = require("./mrequire");

const SyncFileSystem = require("../System/IO/Native/SyncFileSystem");


function isDigit(ch) {
    return ch >= "0".charCodeAt(0) && ch <= "9".charCodeAt(0);
}


function extractVersion(fileName, fromIndex) {
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
}


function splitFileName(fileName) {
    const extension = Path.extname(fileName);
    const version = extractVersion(fileName, fileName.length - extension.length);

    return {
        name: fileName.substr(0, fileName.length - extension.length - version.length),
        version: version,
        extension: extension
    };
}


function use2(module, fileName) {
    const fullFileName = Path.isAbsolute(fileName) ? fileName : Path.join(process.cwd(), fileName);
    const splitName = splitFileName(fullFileName);
    const targetName = splitName.name + ".js";


    const modificationDate = fileName =>
        SyncFileSystem.stat(fileName).map(s => s.mtime);


    const hasTarget = () =>
        SyncFileSystem.fileExists(targetName);


    function targetOlderThanSource() {
        const sourceDateTime = modificationDate(fullFileName);
        const targetDateTime = modificationDate(targetName);

        return sourceDateTime.map(t => t.getTime()).withDefault(0) >= targetDateTime.map(t => t.getTime()).withDefault(0);
    }

    if (!hasTarget() || targetOlderThanSource()) {
        console.log(`Compiling ${fullFileName}`);
        const result = module(fullFileName, targetName);
        if (result.isError()) {
            throw new Error(result.toString());
        }
    }

    return require(targetName);
}


function use(fileName) {
    if (fileName.endsWith(".js")) {
        return require(fileName);
    } else {
        const split = splitFileName(fileName);

        if (split.version === "") {
            return use2(require(`../Tool/${split.extension.substr(1)}/Use`), fileName);
        } else {
            return use2(mrequire(`core:Tool.${split.extension.substr(1)}:${split.version.substr(1)}`), fileName);
        }
    }
}


module.exports = use;