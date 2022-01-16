import resizersTests from '../handlers/resizingHandler/test.js'
const t = {
    ALL: -1,
    RESIZING: 0,
    TEXTCHANGE: 1
};

function unitTest(whichTests, getSheetDimensions, getChangeHistoryAndIndex) {
    // any setInterval() will require joining FIFO queue using turn{}
    let turn = {
        current: 1,
        nextAvailable: 1
    };
    if (whichTests.length == 1 && whichTests[0] == t.ALL) whichTests = t.values().slice(1);
    whichTests.forEach(test => {
        switch (test) {
            case t.RESIZING:
                resizersTests(turn, getSheetDimensions, getChangeHistoryAndIndex);
                break;
            case t.TEXTCHANGE: break;
            default: break;
        }
    })
}
function getInLine(turn) {
    let myTurnNumber = turn.nextAvailable++;
    return myTurnNumber;
}
function nextTurn(turn) {
    turn.current++;
}

export {unitTest, getInLine, nextTurn};