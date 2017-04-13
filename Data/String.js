function foldl(string) {
    return z => f => {
        let result = z;
        for (let i = 0; i < string.length; i += 1) {
            result = f(result)(string[i]);
        }

        return result;
    }
}
assumption(foldl("Hello")(0)(a => b => a + 1) === 5);


module.exports = {
    foldl
};