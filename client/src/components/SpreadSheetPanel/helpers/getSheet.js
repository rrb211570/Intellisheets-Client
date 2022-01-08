let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let defaultSheet = (rows, defaultHeight, cols, defaultWidth) => {
    let topAxis = []; // Top Axis Row
    topAxis.push(<div className='row0 col0 origin' style={{ height: `${defaultHeight}px`, width: `${defaultWidth / 2}px` }}>&nbsp;</div>)
    for (let i = 0; i < cols; ++i) {
        let letter = alphabet[i < 26 ? i : i % 26];
        topAxis.push(<div className={`row0 col${i + 1} AxisX`} style={{ height: `${defaultHeight}px`, width: `${defaultWidth}px`, marginLeft: `${defaultWidth * i + defaultWidth / 2}px` }}><p>{letter}</p></div>)
    }

    let rowsArr = []; // Remaining Rows
    for (let i = 0; i < rows; ++i) {
        let row = [];
        row.push(<div className={`row${i + 1} col0 AxisY`} style={{ height: `${defaultHeight}px`, width: `${defaultWidth / 2}px` }}>
            <p>{i + 1}</p>
        </div>);
        for (let j = 1; j < cols + 1; ++j) {
            row.push(<div className={`row${i + 1} col${j} entryCell`} style={{ height: `${defaultHeight}px`, width: `${defaultWidth}px`, marginLeft: `${defaultWidth * (j - 1) + defaultWidth / 2}px` }}><input onBlur={showCoverEvent} onKeyUp={stopPropagation} onKeyDown={stopPropagation} type='text' style={{ height: `${defaultHeight - 4}px`, width: `${defaultWidth - 4}px`, border: 'none' }}></input><div id='cover' tabIndex='-1' onClickCapture={selectCell} onBlur={unselectCell} onDoubleClickCapture={hideCoverEvent} style={{ position: 'absolute', left: '0', top: '0', height: `${defaultHeight}px`, width: `${defaultWidth}px`, border: 'none' }}></div></div>)
        }
        rowsArr.push(row);
    }

    let table = []; // Combine Rows
    table.push(<div id='row0' className='row0' style={{height: `${defaultHeight}px`}}>{topAxis}</div>);
    for (let j = 0; j < rowsArr.length; ++j) {
        table.push(<div id={`row${j + 1}`} className={`row${j + 1}`} style={{height: `${defaultHeight}px`, width: `${defaultWidth * cols + defaultWidth / 2}px` }}>
            {rowsArr[j]}
        </div>);
    }

    return table;
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

function loadedSheet(loadedSheet) {
    return (
        <div id='content'>
        </div>
    );
}

export { defaultSheet, loadedSheet};