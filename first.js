#!/usr/local/bin/node --require /Users/graeme.lockley/Workspace/github/mn/mn-workspace/startup

const Maybe = mrequire("core:Data.Maybe:v1.0.0");

console.log(Maybe.Just(10));
console.log(Maybe.Nothing);
