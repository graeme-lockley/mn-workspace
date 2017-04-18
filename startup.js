const Prelude = require("./lib/Prelude");
global.mrequire = Prelude.mrequire;
global.use = Prelude.use;

const Assumption = mrequire("core:assumption:v1.0.0");

global.assumption = Assumption.assumption;
global.assumptionEqual = Assumption.assumptionEqual;

module.exports = {};
