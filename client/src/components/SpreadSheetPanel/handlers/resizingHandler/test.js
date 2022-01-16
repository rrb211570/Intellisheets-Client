import { getInLine, nextTurn } from '../../tests/endToEnd.js'
import Data from '../../core/history/data.js';
import { getResizableColData, getResizableRowData } from './resizingHandler.js'

function resizersTests(turn, getSheetDimensions, getChangeHistoryAndIndex) {
    console.log('\n--------RESIZING TESTs-----------------------');
    checkHorizontalResizersInitialization();
    checkVerticalResizersInitialization();

    let axisCellsX = document.querySelectorAll('.AxisX');
    let axisCellsY = document.querySelectorAll('.AxisY');
    try {
        checkReactionOfResizingOnTable(axisCellsX, 10, turn, getSheetDimensions, getChangeHistoryAndIndex);
        checkReactionOfResizingOnTable(axisCellsY, 10, turn, getSheetDimensions, getChangeHistoryAndIndex);
        checkReactionOfResizingOnTable([axisCellsX[0]], -20, turn, getSheetDimensions, getChangeHistoryAndIndex);
        checkReactionOfResizingOnTable(axisCellsY, -12, turn, getSheetDimensions, getChangeHistoryAndIndex);
    } catch (error) {
        console.log('resizingErr:checkReactionOfResizing: ' + error);
    }
}
function checkHorizontalResizersInitialization() {
    try {
        let elems = document.querySelectorAll('.AxisX');
        let sheet = document.querySelector('#spreadsheet');
        let logMsg = '';
        elems.forEach((elem, idx) => {
            let resizer = elem.querySelector('.resizer-horizontal')
            if (resizer == null) {
                logMsg = logMsg + 'col' + (idx + 1) + ': horizontal resizer not found\n';
            } else if (parseInt(sheet.style.height, 10) != (parseInt(resizer.style.height, 10))) {
                logMsg = logMsg + 'col' + (idx + 1) + ': horizontal resizer does not match sheet height' + sheet.style.height + ' ' + resizer.style.height + '\n';
            }
        })
        if (logMsg.length != 0) console.log(logMsg);
        else console.log('horizontalResizers appended correctly');
    } catch (error) {
        console.log('checkHorizontalResizersInitialization(): ' + error);
    }
}
function checkVerticalResizersInitialization() {
    try {
        let elems = document.querySelectorAll('.AxisY');
        let sheet = document.getElementById('spreadsheet');
        let logMsg = '';
        elems.forEach((elem, idx) => {
            let resizer = elem.querySelector('.resizer-vertical')
            if (resizer == null) {
                logMsg = logMsg + 'row' + idx + ': vertical resizer not found\n';
            } else if (parseInt(sheet.style.width, 10) != (parseInt(resizer.style.width, 10))) {
                logMsg = logMsg + 'row' + idx + ': vertical resizer does not match sheet width' + sheet.style.width + ' ' + resizer.style.width + '\n';
            }
        })
        if (logMsg.length != 0) console.log(logMsg);
        else console.log('verticalResizers appended correctly');
    } catch (error) {
        console.log('checkVerticalResizersInitialization(): ' + error);
    }
}
function checkReactionOfResizingOnTable(axisCells, deltaIncrement, turn, getSheetDimensions, getChangeHistoryAndIndex) {
    let timer;
    try {
        let axisClass = getAxisClass(axisCells);
        let resizer;
        let delta = 0;
        let index = -1;
        let myTurnNumber = getInLine(turn);
        let mouseState = -1;
        let dimensionsBeforeMove;
        let dimensionsAfterMove;
        let changeHistoryBeforeMove;
        let changeHistoryIndexBeforeMove;
        let changeHistoryAfterMove;
        let changeHistoryIndexAfterMove;
        timer = setInterval(() => {
            switch (mouseState) {
                case -1: // FIFO waiting queue
                    if (turn.current == myTurnNumber) mouseState = 0;
                    break;
                case 0:
                    if (++index < axisCells.length) {
                        resizer = getResizer(axisCells[index], axisClass)
                        mouseState++;
                    } else {
                        nextTurn(turn); // increment turn.current
                        clearInterval(timer);
                    }
                    break;
                case 1:
                    resizer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    try {
                        dimensionsBeforeMove = captureResizerData(axisClass, axisCells[index], getSheetDimensions);
                        [changeHistoryBeforeMove, changeHistoryIndexBeforeMove] = getChangeHistoryAndIndex();
                    } catch (error) {
                        console.log('resizingErr: ' + error);
                        clearInterval(timer);
                    }
                    mouseState++;
                    break;
                case 2:
                case 3:
                case 4:
                    let params = { bubbles: true, cancelable: true };
                    params[axisClass == 'AxisX' ? 'clientX' : 'clientY'] = delta += deltaIncrement;
                    resizer.dispatchEvent(new MouseEvent('mousemove', params));
                    mouseState++;
                    break;
                case 5:
                    resizer.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                    try {
                        dimensionsAfterMove = captureResizerData(axisClass, axisCells[index], getSheetDimensions);
                        [changeHistoryBeforeMove, changeHistoryIndexBeforeMove] = getChangeHistoryAndIndex();
                        if (!expectedTableChanges(axisClass, dimensionsBeforeMove, dimensionsAfterMove, delta)) throw 'mousemove: resizer not affecting table correctly';
                        if (!expectedChangeHistoryChanges(axisClass, delta, changeHistoryBeforeMove, changeHistoryIndexBeforeMove, changeHistoryAfterMove, changeHistoryIndexAfterMove)) throw 'mousemove: resizer not affecting changeHistory properly';
                    } catch (error) {
                        console.log('resizingErr: ' + error);
                        clearInterval(timer);
                    }
                    delta = 0;
                    mouseState = 0;
                    break;
                default: break;
            }
        }, 5);
    } catch (error) {
        console.log('resizingErr: ' + error);
        clearInterval(timer);
    }
}
function getAxisClass(axisCells) {
    let arr = [];
    if (typeof axisCells !== typeof arr) throw 'getAxisClass(): axisCells is not an array';
    if (axisCells.length == 0) throw 'getAxisClass(): axisCells is empty';
    if (axisCells instanceof Element) throw 'getAxisClass(): axisCells should be an array of DOM elements'
    if (!(axisCells[0] instanceof Element)) throw 'getAxisClass(): axisCells should be an array of DOM elements';
    let axisName = [...axisCells[0].classList].filter(name => /^Axis.$/.test(name));
    if (axisName.length == 0) throw 'getAxisClass(): axisClass not found in axisCells[0]';
    if (axisName[0] != 'AxisX' && axisName[0] != 'AxisY') throw 'getAxisClass(): found axis class not equal to "AxisX" or "AxisY"'
    return axisName[0];
}
function getResizer(axisCell, axisClass) {
    if (!(axisCell instanceof Element)) throw 'getResizer(): axisCell should be a valid DOM element';
    let reg = new RegExp(axisClass);
    let possibleAxisClass = [...axisCell.classList].filter(name => reg.test(name));
    if (possibleAxisClass.length == 0) throw 'getResizer(): axisCell\'s axis class must match axis parameter';
    let resizer = axisCell.querySelector(axisClass == 'AxisX' ? '.resizer-horizontal' : '.resizer-vertical');
    if (!resizer instanceof Element) throw 'getResizer(): resizer not found in axisCell';
    return resizer;
}
function getChangeHistoryBeforeMove() {

}
function getChangeHistoryAfterMove() {

}
function captureResizerData(axisClass, axisCell, getSheetDimensions) {
    if (axisClass == 'AxisX') {
        let colNum = getResizerIndex(axisClass, axisCell);
        let cellWidth = parseInt(axisCell.style.width, 10);
        return getResizableColData(colNum, cellWidth, getSheetDimensions()[1])
    } else {
        let rowNum = getResizerIndex(axisClass, axisCell);
        let cellHeight = parseInt(axisCell.style.height, 10);
        return getResizableRowData(rowNum, cellHeight, getSheetDimensions()[0]);
    }
}
function getResizerIndex(axisClass, axisCell) {
    if (axisClass == 'AxisX') return parseInt([...axisCell.classList].filter(name => /^col.$/.test(name))[0].slice(-1), 10);
    else return parseInt([...axisCell.classList].filter(name => /^row.$/.test(name))[0].slice(-1), 10);
}
// check that when delta is applied to all width/marginLeft values in dimensionsBeforeMove,
// that it is reflected in dimensionsAfterMove
function expectedTableChanges(axisClass, dimensionsBeforeMove, dimensionsAfterMove, delta) {
    try {
        if (axisClass == 'AxisX') {
            for (const [entryKey, data] of dimensionsBeforeMove.getEntries()) {
                if (!dimensionsAfterMove.hasEntry(entryKey)) throw entryKey + ' in dimensionsBeforeMove, but not found in dimensionsAfterMove';
                let dataAfter = dimensionsAfterMove.getEntry(entryKey);
                let beforeStyleMap = data.getStyleMap();
                let afterStyleMap = dataAfter.getStyleMap();
                if (beforeStyleMap.size != 1 || afterStyleMap.size != 1) throw entryKey + ' should not have multiple styleMap entries'
                if (entryKey == 'spreadsheet') {
                    if (beforeStyleMap.get('width') == null || afterStyleMap.get('width') == null) throw entryKey + ' is missing property "width"';
                    if (beforeStyleMap.get('width') + delta != afterStyleMap.get('width')) throw entryKey + ' width not updated properly';
                } else if (!/.col./.test(entryKey)) {
                    if (beforeStyleMap.get('width') == null || afterStyleMap.get('width') == null) throw entryKey + ' is missing property "width"';
                    if (beforeStyleMap.get('width') + delta != afterStyleMap.get('width')) throw entryKey + ' width not updated properly';
                    if (data.row != dataAfter.row) throw entryKey + ' row does not match';
                } else {
                    if (data.cellRow != dataAfter.cellRow) throw entryKey + ' row does not match';
                    if (data.cellCol != dataAfter.cellCol) throw entryKey + ' col does not match';
                    if (data.val != dataAfter.val) throw entryKey + ' val does not match';
                    if (beforeStyleMap.get('width') == null) {
                        if (beforeStyleMap.get('marginLeft') == null || afterStyleMap.get('marginLeft') == null) throw entryKey + ' is missing property "marginLeft"';
                        if (beforeStyleMap.get('marginLeft') + delta != afterStyleMap.get('marginLeft')) throw entryKey + ' marginLeft not updated properly';
                    } else {
                        if (afterStyleMap.get('width') == null) throw entryKey + ' is missing property "width"';
                        if (beforeStyleMap.get('width') + delta != afterStyleMap.get('width')) throw entryKey + ' width not updated properly';
                    }
                }
            }
        } else {
            for (const [entryKey, data] of dimensionsBeforeMove.getEntries()) {
                if (!dimensionsAfterMove.hasEntry(entryKey)) throw entryKey + ' in dimensionsBeforeMove, but not found in dimensionsAfterMove';
                let dataAfter = dimensionsAfterMove.getEntry(entryKey);
                let beforeStyleMap = data.getStyleMap();
                let afterStyleMap = dataAfter.getStyleMap();
                if (beforeStyleMap.size != 1 || afterStyleMap.size != 1) throw entryKey + ' should not have multiple styleMap entries'
                if (beforeStyleMap.get('height') == null || afterStyleMap.get('height') == null) throw entryKey + ' is missing property "height"';
                if (beforeStyleMap.get('height') + delta != afterStyleMap.get('height')) throw entryKey + ' height not updated properly';
                if (!/.col./.test(entryKey)) {
                    if (data.row != dataAfter.row) throw entryKey + ' row does not match';
                } else {
                    if (data.cellRow != dataAfter.cellRow) throw entryKey + ' row does not match';
                    if (data.cellCol != dataAfter.cellCol) throw entryKey + ' col does not match';
                    if (data.val != dataAfter.val) throw entryKey + ' val does not match';
                }
            }
        }
        return true;
    } catch (error) {
        throw 'expectedChanges(): ' + error;
    }
}

function expectedChangeHistoryChanges(axisClass, delta, changeHistoryBeforeMove, changeHistoryIndexBeforeMove, changeHistoryAfterMove, changeHistoryIndexAfterMove) {
    try{
        return true;
    }catch(error){
        throw 'expectedChangeHistoryChanges(): '+error;
    }
}

export default resizersTests;