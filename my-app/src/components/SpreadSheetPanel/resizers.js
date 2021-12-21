function applyResizers(height, width, getSheetDimensions, setSheetDimensions, recordChange) {
    fixResizers('col', height, width, getSheetDimensions, setSheetDimensions, recordChange);
    fixResizers('row', height, width, getSheetDimensions, setSheetDimensions, recordChange);
}

function fixResizers(axis, height, width, getSheetDimensions, setSheetDimensions, recordChange) {
    let table = document.getElementById('spreadsheet');
    let axisEntries = axis === 'col' ? [...table.querySelectorAll('.AxisX')] : [...table.querySelectorAll('.col0')];
    axisEntries.forEach(entry => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer-' + (axis === 'col' ? 'top' : 'left'));
        axis === 'col' ? resizer.style.height = `${height}px` : resizer.style.width = `${width}px`;
        entry.appendChild(resizer);
        createResizableColumn(entry, axis, resizer, getSheetDimensions, setSheetDimensions, recordChange);
    });
}

function createResizableColumn(entry, axis, resizer, getSheetDimensions, setSheetDimensions, recordChange) {
    let x = 0;
    let y = 0;
    let h = 0;
    let w = 0;
    let spreadSheetDimensions = [];
    let entries = [];
    let colMarginsLeft = [];
    let rowWidth = 0;
    let changeOccurred = false;
    let table = document.getElementById('spreadsheet');

    const mouseDownHandler = function (e) {
        spreadSheetDimensions = getSheetDimensions();
        if (axis === 'col') {
            x = e.clientX;
            w = parseInt(window.getComputedStyle(entry).width, 10);
            let colNum = parseInt([...entry.classList].filter(name => /^col.$/.test(name))[0].slice(-1));
            addEntries(entries, axis, colNum, [null, w],spreadSheetDimensions); // store current state
            storeColMargins(colMarginsLeft, colNum);
            rowWidth = parseInt(document.getElementById('row0').style.width, 10);
        } else {
            y = e.clientY;
            h = parseInt(window.getComputedStyle(entry).height, 10);
            let rowNum = [...entry.classList].filter(name => /^row.$/.test(name))[0].slice(-1);
            addEntries(entries, axis, rowNum, [h, null],spreadSheetDimensions); // store current state
        }
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-' + (axis === 'col' ? 'top' : 'left'));
    };

    // disable resizing if table.width == content.width
    const mouseMoveHandler = function (e) {
        if (axis === 'col') {
            changeOccurred = x != e.clientX ? true : false;
            const dx = w + e.clientX - x < 0 ? -w + 1 : e.clientX - x; // set dx so as to maintain 1 pixel minimum width
            let colNum = parseInt([...entry.classList].filter(name => /^col.$/.test(name))[0].slice(-1), 10);
            updateWidths(colNum, w, rowWidth, dx);
            updateColMargins(colNum + 1, colMarginsLeft, dx);
            let sheetWidth = spreadSheetDimensions[1] + dx;
            setSheetDimensions(spreadSheetDimensions[0], sheetWidth);
            table.querySelectorAll('.resizer-left').forEach(resizerDiv => resizerDiv.style.width = `${sheetWidth}px`);
        } else {
            changeOccurred = y != e.clientY ? true : false;
            const dy = h + e.clientY - y < 0 ? -h + 1 : e.clientY - y; // set dy so as to maintain 1 pixel minimum height
            let rowNum = [...entry.classList].filter(name => /^row.$/.test(name))[0].slice(-1);
            updateHeights(rowNum, h, dy);
            let sheetHeight = spreadSheetDimensions[0] + dy;
            setSheetDimensions(sheetHeight, spreadSheetDimensions[1]);
            table.querySelectorAll('.resizer-top').forEach(resizerDiv => resizerDiv.style.height = `${sheetHeight}px`);
        }
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-' + (axis === 'col' ? 'top' : 'left'));
        if (changeOccurred) {
            if (axis == 'col') {
                let colNum = parseInt([...entry.classList].filter(name => /^col.$/.test(name))[0].slice(-1), 10);
                let len = table.querySelectorAll(`.col${colNum}`).length;
                let newWidth = parseInt(table.querySelector(`.col${colNum}`).style.width, 10);
                for (let i = 0; i < len; ++i) {
                    entries[i].push([null, [['width', newWidth]]]);
                }
                for (let i = 1; i < (entries.length - 1) / len; ++i) {
                    let newMarginLeft = parseInt(table.querySelector(`.col${colNum + i}`).style.marginLeft, 10);
                    for (let j = 0; j < len; ++j) {
                        entries[len * i + j].push([null, [['marginLeft', newMarginLeft]]]);
                    }
                }
                entries[len * 2].push([null, [['width', rowWidth + parseInt(entry.style.width,10) - w+4]]]);
                console.log(rowWidth+' '+entry.style.width+' '+w);
                for (let i = 0; i < len; ++i) {
                    entries.push([`.row${i}`, null, [null, [['width', rowWidth]]], [null, [['width', rowWidth + entry.style.width - w]]]]);
                }
            } else {
                let rowNum = [...entry.classList].filter(name => /^row.$/.test(name))[0].slice(-1);
                let newHeight = table.querySelector(`.row${rowNum}`).style.height;
                for (let i = 0; i < entries.length - 1; ++i) {
                    entries[i].push([null, [['height', newHeight]]]);
                }
                entries[entries.length - 1].push([null, [['height', spreadSheetDimensions[0] + entry.style.height - h+4]]]);
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

function addEntries(entries, axis, index, [height, width],[sheetHeight, sheetWidth]) {
    let table = document.getElementById('spreadsheet');
    if (axis === 'col') {
        entries.push(...[...table.querySelectorAll(`.col${index}`)].map((val, idx) => {
            return [`.row${idx}`, `.col${index}`, [null, [['width', width]]]];
        }));
        let arr = [];
        while ((arr = [...table.querySelectorAll(`.col${++index}`)]).length != 0) {
            entries.push(...arr.map((val, idx) => {
                return [`.row${idx}`, `.col${index}`, [null, [['marginLeft', parseInt(val.style.marginLeft)]]]];
            }));
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