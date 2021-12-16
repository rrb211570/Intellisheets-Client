function applyResizers(height, width, getSheetDimensions, setSheetDimensions, funct1) {
    fixResizers('col', height, width, getSheetDimensions, setSheetDimensions, funct1);
    fixResizers('row', height, width, getSheetDimensions, setSheetDimensions, funct1);
}

function fixResizers(axis, height, width, getSheetDimensions, setSheetDimensions, funct1) {
    let table = document.getElementById('spreadsheet');
    let axisEntries = [];;
    if (axis === 'col') axisEntries = [...table.querySelectorAll('.AxisX')];
    else {
        axisEntries = [...table.querySelectorAll('.col0')];
    }
    axisEntries.reduce((NULL, entry) => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer-' + (axis === 'col' ? 'top' : 'left'));
        if (axis === 'col') resizer.style.height = `${height}px`;
        else resizer.style.width = `${width}px`;
        entry.appendChild(resizer);

        createResizableColumn(entry, axis, getSheetDimensions, setSheetDimensions, funct1);
    });

}

function createResizableColumn(entry, axis, getSheetDimensions, setSheetDimensions, funct1) {
    let x = 0;
    let y = 0;
    let h = 0;
    let w = 0;
    let colMarginsLeft = [];
    let rowHeights = [];
    let rowWidths = [];
    let spreadSheetDimensions = [];
    let table = document.getElementById('spreadsheet');
    let resizer = entry.querySelector(axis === 'col' ? '.resizer-top' : '.resizer-left');

    const mouseDownHandler = function (e) {
        spreadSheetDimensions = getSheetDimensions();
        if (axis === 'col') {
            x = e.clientX;
            w = parseInt(window.getComputedStyle(entry).width, 10);
            // get colWidths
            let colNum = [...entry.classList].filter(name => /^col.$/.test(name))[0].slice(-1);
            for (let i = 0; i < colNum; ++i) colMarginsLeft.push(null);
            while (1) {
                let arr = [...table.querySelectorAll(`.col${colNum}`)];
                if (arr.length == 0) break;
                colMarginsLeft.push(parseInt(arr[0].style.marginLeft, 10));
                colNum++;
            }
            let rowIndex = 0;
            while (1) {
                let arr = [...table.querySelectorAll(`#row${rowIndex}`)];
                if (arr.length == 0) break;
                rowWidths.push(parseInt(arr[0].style.width, 10));
                rowIndex++;
            }
        } else {
            y = e.clientY;
            h = parseInt(window.getComputedStyle(entry).height, 10);
            // get rowHeights
            let rowNum = [...entry.classList].filter(name => /^row.$/.test(name))[0].slice(-1);
            for (let i = 0; i < rowNum; ++i) rowHeights.push(null);
            while (1) {
                let arr = [...table.querySelectorAll(`.row${rowNum}Entry`)];
                if (arr.length == 0) break;
                rowHeights.push(parseInt(arr[0].style.marginTop, 10));
                rowNum++;
            }
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-' + (axis === 'col' ? 'top' : 'left'));
    };

    // disable resizing if table.width == content.width
    const mouseMoveHandler = function (e) {
        if (axis === 'col') {
            const preDx = e.clientX - x;
            const dx = w + preDx < 0 ? -w + 1 : preDx; // set dx so as to maintain 1 pixel minimum width
            let colNum = [...entry.classList].filter(name => /^col.$/.test(name))[0].slice(-1);
            let idx = colNum;

            let cols = [];
            for (let i = 0; i < idx; ++i) cols.push(null);
            while (1) {
                let arr = [...table.querySelectorAll(`.col${idx}`)];
                if (arr.length == 0) break;
                cols.push(arr);
                idx++;
            }
            cols[colNum].forEach(box => { //resize selected col
                box.style.width = w + dx + 'px';
            });
            cols[colNum].slice(1).forEach(cell => {
                cell.querySelector('.input').style.width = w + dx - 4 + 'px';
            });
            idx = parseInt(colNum) + 1
            cols.slice(parseInt(colNum) + 1).forEach(col => { //percolate margins to all cols on the right
                col.forEach(box => box.style.marginLeft = colMarginsLeft[idx] + dx + 'px');
                idx++;
            });
            rowWidths.forEach((width, index) => {
                document.getElementById(`row${index}`).style.width = width + dx + 'px';
            });
            let sheetWidth = spreadSheetDimensions[1] + dx;
            setSheetDimensions(getSheetDimensions()[0], sheetWidth);
            table.querySelectorAll('.resizer-left').forEach(resizerDiv => resizerDiv.style.width = `${sheetWidth}px`);
        } else {
            const preDy = e.clientY - y;
            const dy = h + preDy < 0 ? -h + 1 : preDy; // set dy so as to maintain 1 pixel minimum height
            let rowNum = [...entry.classList].filter(name => /^row.$/.test(name))[0].slice(-1);
            let arr = [...table.querySelectorAll(`.row${rowNum}`)];
            arr[1].style.lineHeight = h + dy + 'px';
            arr.forEach(box => {
                box.style.height = h + dy + 'px';
            });
            arr.slice(2).forEach(cell => {
                cell.querySelector('.input').style.height = h + dy - 4 + 'px';
            });
            let sheetHeight = spreadSheetDimensions[0] + dy;
            setSheetDimensions(sheetHeight, getSheetDimensions()[1]);
            table.querySelectorAll('.resizer-top').forEach(resizerDiv => resizerDiv.style.height = `${sheetHeight}px`);
        }
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-' + (axis === 'col' ? 'top' : 'left'));
        colMarginsLeft = [];
        rowHeights = [];
        rowWidths = [];
        spreadSheetDimensions = [];
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}

export default applyResizers;