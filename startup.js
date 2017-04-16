const Prelude = require("./lib/Prelude");
global.mrequire = Prelude.mrequire;

const Assumption = mrequire("core:assumption:v1.0.0");

global.assumption = Assumption.assumption;
global.assumptionEqual = Assumption.assumptionEqual;

module.exports = {};
