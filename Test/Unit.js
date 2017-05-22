const testSuites = [];


const suite = (suiteName, cases) => {
    const suiteResult = {
        name: suiteName,
        total: 0,
        success: 0,

        suite: (nestedSuiteName, nestedCases) => {
            suite(suiteResult.name + "/" + nestedSuiteName, nestedCases);
            return suiteResult;
        },

        case: (caseName, action) => {
            suiteResult.total += 1;
            new Promise(fulfill => {
                // console.log(`${suiteName}: ${caseName}`);
                action();
                fulfill();
            }).then(_ => {
                suiteResult.success += 1;
            }).catch(error => {
                console.error(`${suiteName}: ${caseName} failed: `, error);
            });

            return suiteResult;
        }
    };

    testSuites.push(suiteResult);
    cases(suiteResult);

    return suiteResult;
};


process.on('exit', function () {
    for (let i = 0; i < testSuites.length; i += 1) {
        const suite = testSuites[i];
        console.log(`${suite.name}: ${suite.success}/${suite.total}`);
    }
});


module.exports = {
    suite,
};