const Result = require("./Data/Result");
const Maybe = mrequire("core:Data.Maybe:v1.0.0");

const Second = require("./second");

console.log(Maybe.Just(10));
console.log(Maybe.Nothing);

console.log(Result.Error("whoops"));
console.log(Second.Okay("success"));
