import resizersTests from '../handlers/resizingHandler/test.js'
const t = {
    ALL: -1,
    RESIZING: 0,
    TEXTCHANGE: 1
};

function unitTest(whichTests) {
    if (whichTests.length == 1 && whichTests[0] == t.ALL) whichTests = t.values().slice(1);
    whichTests.forEach(test => {
        switch (test) {
            case t.RESIZING:
                resizersTests();
                break;
            case t.TEXTCHANGE: break;
            default: break;
        }
    })
}

export default unitTest;