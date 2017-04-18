const Array = mrequire("core:Data.Array:v1.0.0");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");


function range(lower) {
    return upper => {
        if (lower < upper) {
            let result = [];
            for (let lp = lower; lp < upper; lp += 1) {
                result.push(lp);
            }
            return Array.from(result);
        } else {
            let result = [];
            for (let lp = lower; lp > upper; lp -= 1) {
                result.push(lp);
            }
            return Array.from(result);
        }
    };
}
assumptionEqual(range(1)(10), Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]));
assumptionEqual(range(10)(1), Array.from([10, 9, 8, 7, 6, 5, 4, 3, 2]));


Array.ImmutableArray.prototype.reduce = function (fNil) {
    return fCons => {
        if (this.content.length === 0) {
            return fNil();
        } else {
            return fCons(this.content[0])(new Array.ImmutableArray(this.content.slice(1)))
        }
    }
};


Array.ImmutableArray.prototype.zip = function (other) {
    return this.reduce(() => Array.empty)(h => t => other.reduce(() => Array.empty)(ho => to => t.zip(to).cons(Tuple(h)(ho))));
};
assumptionEqual(Array.from(["a", "b", "c"]).zip(range(1)(10)), Array.from([Tuple("a")(1), Tuple("b")(2), Tuple("c")(3)]));
assumptionEqual(Array.from(["a", "b", "c"]).zip(Array.empty), Array.empty);
assumptionEqual(Array.empty.zip(range(1)(10)), Array.empty);


Array.ImmutableArray.prototype.map = function (f) {
    return new Array.ImmutableArray(this.content.map(f));
};
assumptionEqual(range(1)(5).map(n => "p" + n), Array.from(["p1", "p2", "p3", "p4"]));
assumptionEqual(Array.empty.map(n => "p" + n), Array.empty);


Array.ImmutableArray.prototype.join = function (separator) {
    return this.content.join(separator);
};
assumptionEqual(range(1)(5).join(","), "1,2,3,4");
assumptionEqual(Array.empty.join(","), "");


module.exports = {
    from: Array.from,
    singleton: Array.singleton,
    range
};