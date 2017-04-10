String.prototype.foldl = function (z) {
    return f => {
        let result = z;
        for (let i = 0; i < this.length; i += 1) {
            result = f(result)(this[i]);
        }

        return result;
    }
};
assumption("Hello".foldl(0)(a => b => a + 1) === 5);