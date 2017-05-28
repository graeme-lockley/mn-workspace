const random = () =>
    new Promise(accept => accept(Math.random()));


function RandomType(content) {
    this.content = content;
}


RandomType.prototype.next = function () {
    return new RandomType(this.content * 16807 % 2147483647);
};


RandomType.prototype.asNativeInt = function() {
    return this.content;
};


RandomType.prototype.asNativeFloat = function () {
    return (this.content - 1) / 2147483646;
};


const Random = seed => {
    const newSeed = seed % 2147483647;

    return (newSeed <= 0)
        ? new RandomType(newSeed + 2147483646)
        : new RandomType(newSeed);
};


module.exports = {
    Random,
    random
};