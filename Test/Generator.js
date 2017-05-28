const integerInRange = min => max =>
    Math.round(Math.random() * (max.content - min.content) + min.content);


const forall = (gens, action) => () => {
    for (let lp = 0; lp < 1000; lp += 1) {
        action(gens.map(n => n()));
    }
};


module.exports = {
    integerInRange,
    forall
};