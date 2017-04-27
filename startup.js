global.mrequire = require("./lib/mrequire");


const Assumption = mrequire("core:assumption:v1.0.0");
global.assumption = Assumption.assumption;
global.assumptionEqual = Assumption.assumptionEqual;


const Use = require("./lib/Use");
global.use = Use.use;


module.exports = {};
