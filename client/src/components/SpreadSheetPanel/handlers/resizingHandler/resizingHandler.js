import Data from '../../core/history/data.js';
import { hasClass } from '../../misc/util.js'

function applyResizers(functionsBoundToState) {
    fixResizers('AxisX', functionsBoundToState);
    fixResizers('AxisY', functionsBoundToState);
}

function fixResizers(axis, [getSheetDimensions, setSheetDimensions, recordChange]) {
    const axisEntries = [...document.querySelectorAll('.' + axis)]
    axisEntries.forEach(axisCell => {
        let resizer = axisCell.querySelector('div');
        setResizerDimensions(resizer, getSheetDimensions);
        if (axis == 'AxisX') createResizableCol(axisCell, resizer, [getSheetDimensions, setSheetDimensions, recordChange]);
        else createResizableRow(axisCell, resizer, [getSheetDimensions, setSheetDimensions, recordChange])
    });
}

function createResizableCol(axisCell, resizer, [getSheetDimensions, setSheetDimensions, recordChange]) {
    let x = 0;
    let w = 0;
    const colNum = parseInt([...axisCell.classList].filter(name => /^col\d+$/.test(name))[0].match(/(\d+)/)[0],10);
    let spreadSheetDimensions = [];
    let dataBeforeChange = new Data();
    let dataAfterChange = new Data();
    let colMarginsLeft = [];
    let changeOccurred = false;

    const mouseDownHandler = function (e) {
        spreadSheetDimensions = getSheetDimensions();
        x = e.clientX;
        w = parseInt(window.getComputedStyle(axisCell).width, 10);
        dataBeforeChange = getResizableColData(colNum, w, spreadSheetDimensions[1]); // store current state
        storeColMargins(colMarginsLeft, colNum);
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-horizontal');
    };

    // disable resizing if document.width == content.width
    const mouseMoveHandler = function (e) {
        changeOccurred = x != e.clientX ? true : false;
        const dx = w + e.clientX - x < 0 ? -w + 1 : e.clientX - x; // set dx so as to maintain 1 pixel minimum width
        updateWidths(colNum, w, dx);
        updateColMargins(colNum + 1, colMarginsLeft, dx);
        let sheetWidth = spreadSheetDimensions[1] + dx;
        document.querySelectorAll('.resizer-vertical').forEach(resizerDiv => resizerDiv.style.width = `${sheetWidth}px`);
        setSheetDimensions(spreadSheetDimensions[0], sheetWidth);
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-horizontal');
        if (changeOccurred) {
            let newWidth = parseInt(axisCell.style.width, 10);
            dataAfterChange = getResizableColData(colNum, newWidth, getSheetDimensions()[1]);
            recordChange(dataBeforeChange, dataAfterChange);
            changeOccurred = false;
        }
        colMarginsLeft = [];
        spreadSheetDimensions = [];
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}
function createResizableRow(axisCell, resizer, [getSheetDimensions, setSheetDimensions, recordChange]) {
    let y = 0;
    let h = 0;
    const rowNum = parseInt([...axisCell.classList].filter(name => /^row\d+$/.test(name))[0].match(/(\d+)/)[0],10);
    let spreadSheetDimensions = [];
    let dataBeforeChange = new Data();
    let dataAfterChange = new Data();
    let changeOccurred = false;

    const mouseDownHandler = function (e) {
        spreadSheetDimensions = getSheetDimensions();
        y = e.clientY;
        h = parseInt(window.getComputedStyle(axisCell).height, 10);
        dataBeforeChange = getResizableRowData(rowNum, h, spreadSheetDimensions[0]); // store current state
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-vertical');
    };

    // disable resizing if document.width == content.width
    const mouseMoveHandler = function (e) {
        changeOccurred = y != e.clientY ? true : false;
        const dy = h + e.clientY - y < 0 ? -h + 1 : e.clientY - y; // set dy so as to maintain 1 pixel minimum height
        updateHeights(rowNum, h, dy);
        let sheetHeight = spreadSheetDimensions[0] + dy;
        document.querySelectorAll('.resizer-horizontal').forEach(resizerDiv => resizerDiv.style.height = `${sheetHeight}px`);
        setSheetDimensions(sheetHeight, spreadSheetDimensions[1]);
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-vertical');
        if (changeOccurred) {
            let newHeight = parseInt(axisCell.style.height, 10);
            dataAfterChange = getResizableRowData(rowNum, newHeight, getSheetDimensions()[0]);
            recordChange(dataBeforeChange, dataAfterChange);
            changeOccurred = false;
        }
        spreadSheetDimensions = [];
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}

//---------------------------------------------------------------
// ----------- BASEMENT -----------------------------------------
//---------------------------------------------------------------

function setResizerDimensions(resizer, getSheetDimensions) {
    if (hasClass(resizer, 'resizer-horizontal')) resizer.style.height = `${getSheetDimensions()[0]}px`;
    else resizer.style.width = `${getSheetDimensions()[1]}px`;
}

function getResizableColData(index, width, sheetWidth) {
    let myData = new Data();
    document.querySelectorAll(`.col${index}`).forEach((col, idx) => {
        let styleMap = new Map();
        styleMap.set('width', width);
        myData.setEntry(`.row${idx}.col${index}`, styleMap, idx, index, null);
    });
    let arr = [];
    while ((arr = [...document.querySelectorAll(`.col${++index}`)]).length != 0) {
        arr.forEach((col, idx) => {
            let styleMap = new Map();
            styleMap.set('marginLeft', parseInt(col.style.marginLeft));
            myData.setEntry(`.row${idx}.col${index}`, styleMap, idx, index, null);
        });
    }
    let styleMap = new Map();
    styleMap.set('width', sheetWidth);
    myData.setEntry(`spreadsheet`, styleMap);
    return myData;
}
function getResizableRowData(index, height, sheetHeight) {
    let myData = new Data();
    document.querySelectorAll(`.row${index}`).forEach((row, idx) => {
        let styleMap = new Map();
        styleMap.set('height', height);
        myData.setEntry(`.row${index}` + (idx != 0 ? `.col${idx - 1}` : ''), styleMap, index, idx - 1, null);
    });
    let styleMap = new Map();
    styleMap.set('height', sheetHeight);
    myData.setEntry(`spreadsheet`, styleMap);
    return myData;
}

function storeColMargins(colMarginsLeft, colNum) {
    let elem = null;
    while ((elem = document.querySelector(`.col${++colNum}`)) != null) {
        colMarginsLeft.push(parseInt(elem.style.marginLeft, 10));
    }
}

function updateHeights(rowIndex, height, dy) {
    let arr = [...document.querySelectorAll(`.row${rowIndex}`)];
    arr[1].style.lineHeight = height + dy + 'px';
    arr.forEach((cell, index) => {
        if (index > 1) {
            cell.querySelector('input').style.height = height + dy - 4 + 'px';
            cell.querySelector('#cover').style.height = height + dy + 'px';
        }
        cell.style.height = height + dy + 'px';
    });
}

function updateWidths(colIndex, width, dx) {
    let arr = [...document.querySelectorAll(`.col${colIndex}`)];
    arr.forEach((cell, index) => {
        if (index > 0) {
            cell.querySelector('input').style.width = width + dx - 4 + 'px';
            cell.querySelector('#cover').style.width = width + dx + 'px';
        }
        cell.style.width = width + dx + 'px';
    });
}

function updateColMargins(colIndex, colMarginsLeft, dx) {
    let idx = colIndex - 1;
    let arr = [];
    while ((arr = [...document.querySelectorAll(`.col${++idx}`)]).length != 0) {
        arr.forEach(box => box.style.marginLeft = colMarginsLeft[idx - colIndex] + dx + 'px');
    }
}

export { applyResizers, getResizableColData, getResizableRowData };