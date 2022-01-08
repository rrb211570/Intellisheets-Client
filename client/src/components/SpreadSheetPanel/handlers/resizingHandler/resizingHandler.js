import Data from "../../helpers/data";

function applyResizers(height, width, functionsBoundToState) {
    fixResizers('AxisX', height, width, functionsBoundToState);
    fixResizers('AxisY', height, width, functionsBoundToState);
}

function fixResizers(axis, height, width, functionsBoundToState) {
    const axisEntries = getEntries(axis);
    axisEntries.forEach(axisCell => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer-' + (axis === 'AxisX' ? 'horizontal' : 'vertical'));
        axis === 'AxisX' ? resizer.style.height = `${height}px` : resizer.style.width = `${width}px`;
        axisCell.appendChild(resizer);
        createResizableColumn(axisCell, axis, resizer, functionsBoundToState);
    });
}

function getEntries(axis) {
    if (axis === 'AxisX') return [...document.querySelectorAll('.AxisX')];
    else if (axis === 'AxisY') return [...document.querySelectorAll('.AxisY')];
}

function createResizableColumn(axisCell, axis, resizer, [getSheetDimensions, setSheetDimensions, recordChange]) {
    let x = 0;
    let y = 0;
    let h = 0;
    let w = 0;
    const colNum = parseInt([...axisCell.classList].filter(name => /^col.$/.test(name))[0].slice(-1), 10);
    const rowNum = parseInt([...axisCell.classList].filter(name => /^row.$/.test(name))[0].slice(-1), 10);
    let spreadSheetDimensions = [];
    let dataBeforeChange;
    let dataAfterChange;
    let colMarginsLeft = [];
    let changeOccurred = false;

    const mouseDownHandler = function (e) {
        spreadSheetDimensions = getSheetDimensions();
        if (axis === 'AxisX') {
            x = e.clientX;
            w = parseInt(window.getComputedStyle(axisCell).width, 10);
            dataBeforeChange = setData(axis, colNum, [null, w], spreadSheetDimensions); // store current state
            storeColMargins(colMarginsLeft, colNum);
        } else if (axis === 'AxisY') {
            y = e.clientY;
            h = parseInt(window.getComputedStyle(axisCell).height, 10);
            dataBeforeChange = setData(axis, rowNum, [h, null], spreadSheetDimensions); // store current state
        }
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-' + (axis === 'AxisX' ? 'horizontal' : 'vertical'));
    };

    // disable resizing if document.width == content.width
    const mouseMoveHandler = function (e) {
        if (axis === 'AxisX') {
            changeOccurred = x != e.clientX ? true : false;
            const dx = w + e.clientX - x < 0 ? -w + 1 : e.clientX - x; // set dx so as to maintain 1 pixel minimum width
            updateWidths(colNum, w, dx);
            updateColMargins(colNum + 1, colMarginsLeft, dx);
            let sheetWidth = spreadSheetDimensions[1] + dx;
            document.querySelectorAll('.resizer-vertical').forEach(resizerDiv => resizerDiv.style.width = `${sheetWidth}px`);
            setSheetDimensions(spreadSheetDimensions[0], sheetWidth);
        } else {
            changeOccurred = y != e.clientY ? true : false;
            const dy = h + e.clientY - y < 0 ? -h + 1 : e.clientY - y; // set dy so as to maintain 1 pixel minimum height
            updateHeights(rowNum, h, dy);
            let sheetHeight = spreadSheetDimensions[0] + dy;
            document.querySelectorAll('.resizer-horizontal').forEach(resizerDiv => resizerDiv.style.height = `${sheetHeight}px`);
            setSheetDimensions(sheetHeight, spreadSheetDimensions[1]);
        }
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-' + (axis === 'AxisX' ? 'horizontal' : 'vertical'));
        if (changeOccurred) {
            if (axis == 'AxisX') {
                let newWidth = parseInt(axisCell.style.width, 10);
                dataAfterChange = setData(axis, colNum, [null, newWidth], getSheetDimensions())
            } else {
                let newHeight = document.querySelector(`.row${rowNum}`).style.height;
                dataAfterChange = setData(axis, rowNum, [newHeight, null], getSheetDimensions())
            }
            recordChange(dataBeforeChange, dataAfterChange);
            changeOccurred = false;
        }
        colMarginsLeft = [];
        spreadSheetDimensions = [];
        dataBeforeChange.clear()
        dataAfterChange.clear();
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}

function setData(axis, index, [height, width], [sheetHeight, sheetWidth]) {
    let dataBeforeChange = new Data();
    if (axis === 'AxisX') {
        document.querySelectorAll(`.col${index}`).forEach((col, idx) => {
            let styleMap = new Map();
            styleMap.set('width', width);
            dataBeforeChange.setEntry(`.row${idx}.col${index}`, styleMap, idx, index, null);
        });
        let arr = [];
        while ((arr = [...document.querySelectorAll(`.col${++index}`)]).length != 0) {
            arr.forEach((col, idx) => {
                let styleMap = new Map();
                styleMap.set('marginLeft', parseInt(col.style.marginLeft));
                dataBeforeChange.setEntry(`.row${idx}.col${index}`, styleMap, idx, index, null);
            });
        }
        let styleMap = new Map();
        styleMap.set('width', sheetWidth);
        dataBeforeChange.setEntry(`spreadsheet`, styleMap);
    } else {
        document.querySelectorAll(`.row${index}`).forEach((row, idx) => {
            let styleMap = new Map();
            styleMap.set('height', height);
            dataBeforeChange.setEntry(`.row${index}` + (idx != 0 ? `.col${idx - 1}` : ''), styleMap, index, idx - 1, null);
        });
        let styleMap = new Map();
        styleMap.set('height', sheetHeight);
        dataBeforeChange.setEntry(`spreadsheet`, styleMap);
    }
    return dataBeforeChange;
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

export default applyResizers;