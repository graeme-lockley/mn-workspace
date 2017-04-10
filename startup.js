const Prelude = require("./lib/Prelude");
global.mrequire = Prelude.mrequire;

global.assumption = mrequire("core:assumption:v1.0.0");

const Array = require("./Data/Array");
const String = require("./Data/String");

module.exports = {};
