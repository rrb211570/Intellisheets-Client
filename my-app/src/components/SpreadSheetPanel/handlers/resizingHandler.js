function applyResizers(height, width, getSheetDimensions, setSheetDimensions, recordChange) {
    setSheetDimensions(height, width);
    fixResizers('AxisX', height, width, getSheetDimensions, setSheetDimensions, recordChange);
    fixResizers('AxisY', height, width, getSheetDimensions, setSheetDimensions, recordChange);
}

function fixResizers(axis, height, width, getSheetDimensions, setSheetDimensions, recordChange) {
    const axisEntries = getEntries(axis);
    axisEntries.forEach(entry => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer-' + (axis === 'AxisX' ? 'horizontal' : 'vertical'));
        axis === 'AxisX' ? resizer.style.height = `${height}px` : resizer.style.width = `${width}px`;
        entry.appendChild(resizer);
        createResizableColumn(entry, axis, resizer, getSheetDimensions, setSheetDimensions, recordChange);
    });
}

function getEntries(axis) {
    const table = document.getElementById('spreadsheet');
    if (axis === 'AxisX') return [...table.querySelectorAll('.AxisX')].slice(1);
    else if (axis === 'AxisY') return [...table.querySelectorAll('.col0')].slice(1);
}

function createResizableColumn(entry, axis, resizer, getSheetDimensions, setSheetDimensions, recordChange) {
    let x = 0;
    let y = 0;
    let h = 0;
    let w = 0;
    const colNum = parseInt([...entry.classList].filter(name => /^col.$/.test(name))[0].slice(-1), 10);
    const rowNum = parseInt([...entry.classList].filter(name => /^row.$/.test(name))[0].slice(-1), 10);
    let spreadSheetDimensions = [];
    let entries = [];
    let colMarginsLeft = [];
    let rowWidth = 0;
    let changeOccurred = false;
    const table = document.getElementById('spreadsheet');

    const mouseDownHandler = function (e) {
        spreadSheetDimensions = getSheetDimensions();
        if (axis === 'AxisX') {
            x = e.clientX;
            w = parseInt(window.getComputedStyle(entry).width, 10);
            addEntries(entries, axis, colNum, [null, w], spreadSheetDimensions); // store current state
            storeColMargins(colMarginsLeft, colNum);
            rowWidth = parseInt(document.getElementById('row0').style.width, 10);
        } else if(axis=== 'AxisY'){
            y = e.clientY;
            h = parseInt(window.getComputedStyle(entry).height, 10);
            addEntries(entries, axis, rowNum, [h, null], spreadSheetDimensions); // store current state
        }
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-' + (axis === 'AxisX' ? 'horizontal' : 'vertical'));
    };

    // disable resizing if table.width == content.width
    const mouseMoveHandler = function (e) {
        if (axis === 'AxisX') {
            changeOccurred = x != e.clientX ? true : false;
            const dx = w + e.clientX - x < 0 ? -w + 1 : e.clientX - x; // set dx so as to maintain 1 pixel minimum width
            updateWidths(colNum, w, rowWidth, dx);
            updateColMargins(colNum + 1, colMarginsLeft, dx);
            let sheetWidth = spreadSheetDimensions[1] + dx;
            setSheetDimensions(spreadSheetDimensions[0], sheetWidth);
            table.querySelectorAll('.resizer-vertical').forEach(resizerDiv => resizerDiv.style.width = `${sheetWidth}px`);
        } else {
            changeOccurred = y != e.clientY ? true : false;
            const dy = h + e.clientY - y < 0 ? -h + 1 : e.clientY - y; // set dy so as to maintain 1 pixel minimum height
            updateHeights(rowNum, h, dy);
            let sheetHeight = spreadSheetDimensions[0] + dy;
            setSheetDimensions(sheetHeight, spreadSheetDimensions[1]);
            table.querySelectorAll('.resizer-horizontal').forEach(resizerDiv => resizerDiv.style.height = `${sheetHeight}px`);
        }
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-' + (axis === 'AxisX' ? 'horizontal' : 'vertical'));
        if (changeOccurred) {
            if (axis == 'AxisX') {
                let len = table.querySelectorAll(`.col${colNum}`).length;
                let newWidth = parseInt(entry.style.width, 10);
                for (let i = 0; i < len; ++i) {
                    entries[i].push([null, [['width', newWidth]]]);
                }
                for (let i = 1; i < ((entries.length - 1) / len) - 1; ++i) {
                    let newMarginLeft = parseInt(table.querySelector(`.col${colNum + i}`).style.marginLeft, 10);
                    for (let j = 0; j < len; ++j) {
                        entries[len * i + j].push([null, [['marginLeft', newMarginLeft]]]);
                    }
                }
                for (let i = entries.length - 1 - len; i < entries.length - 1; ++i) {
                    entries[i].push([null, [['width', parseInt(document.getElementById(`row${0}`).style.width, 10)]]]);
                }
                entries[entries.length - 1].push([null, [['width', parseInt(document.getElementById(`row${0}`).style.width, 10) + 4]]]);
            } else {
                for (let i = 0; i < entries.length - 1; ++i) {
                    entries[i].push([null, [['height', parseInt(entry.style.height, 10)]]]);
                }
                entries[entries.length - 1].push([null, [['height', parseInt(document.getElementById('spreadsheet').style.height, 10)]]]);
            }
            recordChange(entries);
            changeOccurred = false;
        }
        colMarginsLeft = [];
        spreadSheetDimensions = [];
        entries = [];
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}

function addEntries(entries, axis, index, [height, width], [sheetHeight, sheetWidth]) {
    let table = document.getElementById('spreadsheet');
    if (axis === 'AxisX') {
        entries.push(...[...table.querySelectorAll(`.col${index}`)].map((val, idx) => {
            return [`.row${idx}`, `.col${index}`, [null, [['width', width]]]];
        }));
        let arr = [];
        while ((arr = [...table.querySelectorAll(`.col${++index}`)]).length != 0) {
            entries.push(...arr.map((val, idx) => {
                return [`.row${idx}`, `.col${index}`, [null, [['marginLeft', parseInt(val.style.marginLeft)]]]];
            }));
        }
        for (let i = 0; i < table.querySelectorAll(`.col0`).length; ++i) {
            entries.push([`.row${i}`, null, [null, [['width', sheetWidth - 4]]]]);
        }
        entries.push([null, null, [null, [['width', sheetWidth]]]]);
    } else {
        [...table.querySelectorAll(`.row${index}`)].slice(1).forEach((val, idx) => {
            entries.push([`.row${index}`, `.col${idx}`, [null, [['height', height]]]]);
        });
        entries.push([`.row${index}`, null, [null, [['height', height]]]]);
        entries.push([null, null, [null, [['height', sheetHeight]]]]);
    }
}

function storeColMargins(colMarginsLeft, colNum) {
    let table = document.getElementById('spreadsheet');
    let elem = null;
    while ((elem = table.querySelector(`.col${++colNum}`)) != null) {
        colMarginsLeft.push(parseInt(elem.style.marginLeft, 10));
    }
}

function updateHeights(rowIndex, height, dy) {
    let table = document.getElementById('spreadsheet');
    let arr = [...table.querySelectorAll(`.row${rowIndex}`)];
    arr[1].style.lineHeight = height + dy + 'px';
    arr.forEach((cell, index) => {
        if (index > 1) {
            cell.querySelector('.input').style.height = height + dy - 4 + 'px';
            cell.querySelector('#cover').style.height = height + dy + 'px';
        }
        cell.style.height = height + dy + 'px';
    });
}

function updateWidths(colIndex, width, rowWidth, dx) {
    let table = document.getElementById('spreadsheet');
    let arr = [...table.querySelectorAll(`.col${colIndex}`)];
    arr.forEach((cell, index) => {
        if (index > 0) {
            cell.querySelector('.input').style.width = width + dx - 4 + 'px';
            cell.querySelector('#cover').style.width = width + dx + 'px';
        }
        cell.style.width = width + dx + 'px';
        document.getElementById(`row${index}`).style.width = rowWidth + dx + 'px';
    });
}

function updateColMargins(colIndex, colMarginsLeft, dx) {
    let table = document.getElementById('spreadsheet');
    let idx = colIndex - 1;
    let arr = [];
    while ((arr = [...table.querySelectorAll(`.col${++idx}`)]).length != 0) {
        arr.forEach(box => box.style.marginLeft = colMarginsLeft[idx - colIndex] + dx + 'px');
    }
}

export default applyResizers;