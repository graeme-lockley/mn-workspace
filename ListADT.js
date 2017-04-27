const State = use("./ListADTState.2.0.0.adt");


State.ListADTState.prototype.length = function () {
	return this.reduce(() => 0)(head => tail => 1 + tail.length());
};


module.exports = {
	Nil: State.Nil,
	Cons: State.Cons
};
