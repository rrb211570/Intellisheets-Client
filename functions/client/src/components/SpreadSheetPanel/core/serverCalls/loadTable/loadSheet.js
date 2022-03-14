let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let loadSheet = (loadedSheet, rows, cols, defaultHeight, defaultWidth) => {
    let loadedIndividuals = [];
    if (loadedSheet != null && loadedSheet.hasOwnProperty('data')) {
        rows = parseInt(loadedSheet.rows, 10);
        cols = parseInt(loadedSheet.cols, 10);

        loadedIndividuals = initializeEmptyLoadedIndividuals(rows + 1, cols + 2);
        loadedIndividuals = initializeWithIndividual(loadedSheet, loadedIndividuals);
        loadedIndividuals = initializeWithGroup(loadedSheet, loadedIndividuals, defaultWidth);
    }
    console.log(loadedIndividuals);

    let topAxis = []; // Top Axis Row
    topAxis.push(<div className='row0 col0 origin' style={{ height: `${defaultHeight}px`, width: `${defaultWidth / 2}px` }}>&nbsp;</div>)
    for (let i = 0; i < cols; ++i) {
        let letter = alphabet[i < 26 ? i : i % 26];
        let defaultMarginLeft = defaultWidth * i + defaultWidth / 2;
        let width = loadedIndividuals.length != 0 ? getWidth(loadedIndividuals[0][i + 2], defaultWidth) : defaultWidth;
        let marginLeft = loadedIndividuals.length != 0 ? getMarginLeft(loadedIndividuals[0][i + 2], defaultMarginLeft) :
            defaultMarginLeft;
        topAxis.push(<div className={`row0 col${i + 1} AxisX`} style={{ height: `${defaultHeight}px`, width: `${width}px`, marginLeft: `${marginLeft}px` }}><p>{letter}</p><div className='resizer-horizontal'></div></div>)
    }

    let rowsArr = []; // Remaining Rows
    for (let i = 0; i < rows; ++i) {
        let row = [];
        let height = loadedIndividuals.length != 0 ? getHeight(loadedIndividuals[i + 1][1], defaultHeight) : defaultHeight;
        row.push(
            <div className={`row${i + 1} col0 AxisY`} style={{ height: `${height}px`, width: `${defaultWidth / 2}px` }}>
                <p>{i + 1}</p>
                <div className='resizer-vertical'></div>
            </div>);
        for (let j = 0; j < cols; ++j) {
            let defaultMarginLeft = defaultWidth * (j) + defaultWidth / 2;
            let val = loadedIndividuals.length != 0 ? getVal(loadedIndividuals[i + 1][j + 2]) : '';
            let height = loadedIndividuals.length != 0 ? getHeight(loadedIndividuals[i + 1][j + 2], defaultHeight) : defaultHeight;
            let width = loadedIndividuals.length != 0 ? getWidth(loadedIndividuals[i + 1][j + 2], defaultWidth) : defaultWidth;
            let marginLeft = loadedIndividuals.length != 0 ? getMarginLeft(loadedIndividuals[i + 1][j + 2], defaultMarginLeft) :
                defaultMarginLeft;
            row.push(
                <div className={`row${i + 1} col${j+1} entryCell`} style={{ height: `${height}px`, width: `${width}px`, marginLeft: `${marginLeft}px` }}>
                    <input onBlur={showCoverEvent} onKeyUp={stopPropagation} onKeyDown={stopPropagation} type='text' style={{ height: `${height - 4}px`, width: `${width - 4}px`, border: 'none' }} defaultValue={val}></input>
                    <div id='cover' tabIndex='-1' onMouseDown={selectCell} onBlur={unselectCell} onDoubleClickCapture={hideCoverEvent} style={{ position: 'absolute', left: '0', top: '0', height: `${height}px`, width: `${width}px`, border: 'none' }}></div>
                </div>);
        }
        rowsArr.push(row);
    }

    // calculate width of row
    let rowWidth = defaultWidth / 2;
    if (loadedIndividuals.length != 0) {
        loadedIndividuals[0].slice(2).forEach(individual => {
            let found = false;
            if (individual.hasOwnProperty('styleMap')) {
                let widthPair = individual.styleMap.filter(pair => pair[0] == 'width');
                if (widthPair.length != 0) {
                    found = true;
                    rowWidth += parseInt(widthPair[0][1], 10);
                }
            }
            if (!found) rowWidth += defaultWidth;
        });
    } else rowWidth += defaultWidth * cols;

    let table = []; // Combine Rows
    table.push(<div id='row0' className='row0' style={{ height: `${defaultHeight}px` }}>{topAxis}</div>);
    for (let j = 0; j < rowsArr.length; ++j) {
        let height = loadedIndividuals.length != 0 ? getHeight(loadedIndividuals[j + 1][0], defaultHeight) : defaultHeight;
        table.push(<div id={`row${j + 1}`} className={`row${j + 1}`} style={{ height: `${height}px`, width: `${rowWidth}px` }}>
            {rowsArr[j]}
        </div>);
    }

    return table;
}

function initializeEmptyLoadedIndividuals(rows, cols) {
    let loadedIndividuals = [];
    for (let i = 0; i < rows; ++i) {
        let emptyRow = [];
        for (let i = 0; i < cols; ++i) emptyRow.push({});
        loadedIndividuals.push(emptyRow);
    }
    return loadedIndividuals;
}

function initializeWithIndividual(loadedSheet, loadedIndividuals) {
    if (loadedSheet.data.hasOwnProperty('individualData')) {
        for (const individual of loadedSheet.data.individualData) {
            if (individual.entryKey != 'spreadsheet' && !/.col\d+/.test(individual.entryKey)) {
                let rowNum = parseInt(individual.row, 10);
                loadedIndividuals[rowNum][0].styleMap = individual.hasOwnProperty('styleMap') ?
                    individual.styleMap : [];
            } else if (/.col\d+/.test(individual.entryKey)) {
                let colNum = parseInt(individual.col, 10);
                let rowNum = parseInt(individual.row, 10);
                if (colNum != 0) {
                    loadedIndividuals[rowNum][colNum + 1].val = individual.val;
                    loadedIndividuals[rowNum][colNum + 1].styleMap = individual.hasOwnProperty('styleMap') ?
                        individual.styleMap : [];
                }
            }
        }
    }
    return loadedIndividuals;
}

function initializeWithGroup(loadedSheet, loadedIndividuals, defaultWidth) {
    if (loadedSheet.data.hasOwnProperty('groupData')) {
        for (const group of loadedSheet.data.groupData) {
            if (/^.col\d+$/.test(group.groupName) && group.hasOwnProperty('styleMap')) {
                let colNum = parseInt(group.groupName.match(/.col(\d+)/)[1], 10);
                let widthPair = group.styleMap.filter(pair => pair[0] == 'width');
                // set provided groupData for colNum
                for (let i = 0; i < loadedIndividuals.length; ++i) {
                    if (!loadedIndividuals[i][colNum + 1].hasOwnProperty('styleMap')) loadedIndividuals[i][colNum + 1].styleMap = [];
                    if (i == 0) { // add width and other stylePairs
                        if (widthPair.length != 0) loadedIndividuals[i][colNum + 1].styleMap.push(widthPair[0]);
                    } else loadedIndividuals[i][colNum + 1].styleMap.push(...group.styleMap);
                    // if width property in groupData, set marginLeft for every col thereafter
                    if (widthPair.length != 0) {
                        let dx = parseInt(widthPair[0][1], 10) - defaultWidth; // dx for existing/default marginLeft
                        for (let j = 1 + colNum + 1; j < loadedIndividuals[0].length; ++j) {
                            if (!loadedIndividuals[i][j].hasOwnProperty('styleMap')) loadedIndividuals[i][j].styleMap = [];
                            let alignPair = loadedIndividuals[i][j].styleMap.filter(pair => pair[0] == 'marginLeft');
                            if (alignPair.length != 0) { // existing marginLeft
                                loadedIndividuals[i][j].styleMap = updateMarginInStyleMap(loadedIndividuals[i][j].styleMap, dx);
                            } else { // default marginLeft
                                loadedIndividuals[i][j].styleMap.push(['marginLeft', defaultWidth * (j - 2) + defaultWidth / 2 + dx]);
                            }
                        }
                    }
                }
            } else if (/^.row\d+$/.test(group.groupName) && group.hasOwnProperty('styleMap')) {
                let rowNum = parseInt(group.groupName.match(/.row(\d+)/)[1], 10);
                let heightPair = group.styleMap.filter(pair => pair[0] == 'height');
                if (heightPair.length != 0) {
                    if (!loadedIndividuals[rowNum][0].hasOwnProperty('styleMap')) loadedIndividuals[rowNum][0].styleMap = [];
                    if (!loadedIndividuals[rowNum][1].hasOwnProperty('styleMap')) loadedIndividuals[rowNum][1].styleMap = [];
                    loadedIndividuals[rowNum][0].styleMap = [heightPair[0]];
                    loadedIndividuals[rowNum][1].styleMap = [heightPair[0]];
                }
                for (let i = 2; i < loadedIndividuals[rowNum].length; ++i) {
                    if (!loadedIndividuals[rowNum][i].hasOwnProperty('styleMap')) loadedIndividuals[rowNum][i].styleMap = []; loadedIndividuals[rowNum][i].styleMap.push(...group.styleMap);
                }
            }
        }
    }
    return loadedIndividuals;
}

function updateMarginInStyleMap(styleMap, dx) {
    return styleMap.map(pair => pair[0] == 'marginLeft' ?
        [pair[0], parseInt(pair[1], 10) + dx] : pair);
}

function getWidth(obj, defaultWidth) {
    let widthPair = obj.hasOwnProperty('styleMap') && (obj.styleMap.length != 0) ? obj.styleMap.filter(pair => pair[0] == 'width') : [];
    return widthPair.length != 0 ? parseInt(widthPair[0][1], 10) : defaultWidth;
}

function getMarginLeft(obj, defaultMarginLeft) {
    let marginPair = obj.hasOwnProperty('styleMap') && (obj.styleMap.length != 0) ? obj.styleMap.filter(pair => pair[0] == 'marginLeft') : [];
    return marginPair.length != 0 ? parseInt(marginPair[0][1], 10) : defaultMarginLeft;
}

function getHeight(obj, defaultHeight) {
    let heightPair = obj.hasOwnProperty('styleMap') && (obj.styleMap.length != 0) ? obj.styleMap.filter(pair => pair[0] == 'height') : [];
    return heightPair.length != 0 ? parseInt(heightPair[0][1], 10) : defaultHeight;
}

function getVal(obj) {
    return (obj.hasOwnProperty('val') && obj.val != null && obj.val != undefined) ? obj.val : '';
}

function stopPropagation(e) {
    e.stopPropagation();
}

function selectCell(e) {
    e.target.focus();
    e.target.style.border = '2px solid blue';
}

function unselectCell(e) {
    e.target.style.border = 'none';
}

function hideCoverEvent(e) {
    e.target.style.zIndex = -1;
    e.target.parentElement.querySelector('input').focus();
}

function showCoverEvent(e) {
    e.target.parentElement.querySelector('#cover').style.zIndex = 1;
}

export { loadSheet };