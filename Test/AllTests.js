#!/usr/bin/env mnode

const Runner = require("./Unit/Runner");

const String = require("../Data/String").String;


Runner(String.of(__dirname))({
    filter: filename => filename.endsWith(String.of("Test.js"))
});
