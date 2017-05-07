#!/usr/bin/env mnode

const Maybe = mrequire("core:Data.Maybe:v1.0.0");

console.log(Maybe.Just(10));
console.log(Maybe.Nothing);
