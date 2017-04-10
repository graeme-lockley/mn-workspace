const Assert = require("assert");


const suites = [];


function newSuite(name) {
    const suite = {
        name: name,
        total: 0,
        success: 0,

        setUp: () => {
        },
        tearDown: () => {
        },

        case: (name, action) => {
            suite.total += 1;

            try {
                suite.setUp();
                action();
                suite.success += 1;
            } catch (e) {
                if (e instanceof Assert.AssertionError) {
                    console.error(`${name}:\n  ${e.stack}`);
                } else {
                    console.error(`${name}:\n  Error: ${e.stack}`)
                }
            }
            try {
                suite.tearDown();
            } catch (e) {
                console.error(`${name}:\n  Error during teardown: ${e.stack}`);
            }

            return suite;
        }
    };

    suites.push(suite);

    return suite;
}


process.on('exit', function () {
    for (let i in suites) {
        const suite = suites[i];
        console.log(`${suite.name}: ${suite.success}/${suite.total}`);
    }
});


module.exports = {
    newSuite
};