import React from 'react';
import applyResizers from './resizers.js'

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let newSheet = false;
const NOCOMMAND = 0;
const CONTROL = 1;
const SHIFT = 2;

class SpreadSheetPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableBoundaryHit: false,
            tableHeight: 0,
            tableWidth: 0,
            table: this.props.loadedSheet.length !== 0 ?
                loadedSheet(this.props.loadedSheet) :
                defaultSheet(parseInt(this.props.rows), parseInt(this.props.defaultRowHeight), parseInt(this.props.cols), parseInt(this.props.defaultColWidth)),
            tableEntries: [],
            changeHistory: [new Map()],
            changeHistoryIndex: 0,
            keyEventState: NOCOMMAND,
        }
        this.setSheetDimensions = this.setSheetDimensions.bind(this);
        this.getSheetDimensions = this.getSheetDimensions.bind(this);
        this.getTable = this.getTable.bind(this);
        this.recordChange = this.recordChange.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.keyUpped = this.keyUpped.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
    }
    componentDidMount() {
        let borderWidth = 2;
        let height = [...document.getElementsByClassName('col0')].reduce(
            (sum, entry) => sum + parseInt(entry.style.height), 0) + 2 * borderWidth;
        let width = parseInt(document.getElementById('row0').style.width) + 2 * borderWidth;
        this.setSheetDimensions(height, width);
        applyResizers(height, width, this.getSheetDimensions, this.setSheetDimensions, this.recordChange); // util.js function
    }
    setSheetDimensions(height, width) {
        this.setState({
            tableHeight: height != null ? height : this.state.tableHeight,
            tableWidth: width !== null ? width : this.state.tableWidth
        });
    }
    getSheetDimensions() {
        return [this.state.tableHeight, this.state.tableWidth];
    }
    getTable() {
        return this.state.table;
    }
    // entries = [ row, col, prevVal, newVal], [entry, prevVal, newVal], ... ]
    recordChange(entries) {
        let prevState = new Map();
        let newState = new Map();
        entries.forEach((entry) => {
            if (!this.state.changeHistory[this.state.changeHistoryIndex].has(`${entry[0]}${entry[1]}`)) {
                prevState.set(`${entry[0]}${entry[1]}`, entry[2]);
            }
            newState.set(`${entry[0]}${entry[1]}`, entry[3]);
        });
        this.state.changeHistory[this.state.changeHistoryIndex].forEach((val, entry) => prevState.set(entry, val));
        let arr = [...this.state.changeHistory.slice(0, this.state.changeHistoryIndex)];
        arr.push(prevState);
        arr.push(newState);
        this.setState({
            changeHistory: arr,
            changeHistoryIndex: this.state.changeHistoryIndex + 1,
        });
        console.log(this.state.changeHistory);
        console.log(this.state.changeHistoryIndex);
    }
    keyPressed(e) {
        switch (this.state.keyEventState) {
            case NOCOMMAND:
                if (e.key == 'Control') {
                    console.log('Control');
                    this.setState({ keyEventState: CONTROL });
                }
                if (e.key == 'Shift') {
                    console.log('Shift');
                    this.setState({ keyEventState: SHIFT });
                }
                break;
            case CONTROL:
                if (e.key == 'z') {
                    this.undo();
                }
                if (e.key == 'y') {
                    this.redo();
                }
                break;
            case SHIFT:
                break;
        }
    }
    keyUpped(e) {
        switch (this.state.keyEventState) {
            case NOCOMMAND:
                console.log('NO COMMAND UP');
                break;
            case CONTROL:
            case SHIFT:
                if (e.key == 'Control' || e.key == 'Shift') {
                    console.log('CTRL/SHIFT UP');
                    this.setState({ keyEventState: NOCOMMAND });
                }
                break;
        }
    }
    undo() {
        console.log('Undo');
        if (this.state.changeHistoryIndex > 0) {
            for (const [key, value] of this.state.changeHistory[this.state.changeHistoryIndex - 1].entries()) {
                console.log(key);
                if (/^\.row.null$/.test(key)) {
                    let entry = document.getElementById(key.match(/row./));
                    applyState(entry, value);
                } else if (/^nullnull$/.test(key)) {
                    let entry = document.getElementById('spreadsheet');
                    applyState(entry, value, this.setSheetDimensions);
                } else {
                    let entry = document.querySelector(key.match(/^\.row.\.col.$/));
                    applyState(entry, value);
                }
            }
            this.setState({ changeHistoryIndex: this.state.changeHistoryIndex - 1 });
        }
    }
    redo() {
        console.log('Redo');
        if (this.state.changeHistoryIndex != this.state.changeHistory.length - 1) {
            //this.setState({changeHistoryIndex: this.state.changeHistoryIndex+1});
        }
    }
    render() {
        return (
            <div className="content" id="contentID" style={{ height: this.props.outerHeight + 'px', width: this.props.outerWidth + 'px' }}>
                <div id='spreadsheet' tabIndex='-1' onKeyDown={this.keyPressed} onKeyUp={this.keyUpped} style={{ height: `${this.state.tableHeight}px`, width: `${this.state.tableWidth}px`, border: '1px solid black' }}>
                    {this.state.table}
                </div>
            </div>
        );
    }
}
export default SpreadSheetPanel;

function applyState(entry, styleArr, func) {
    if (styleArr[0] != null) entry.value = styleArr[0];
    styleArr[1].forEach(([property, value]) => {
        console.log(property + ' ' + value);
        switch (property) {
            case 'height':
                entry.style.height = value + 'px';
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0) {
                    entry.querySelector('.input').style.height = value - 4 + 'px';
                    entry.querySelector('#cover').style.height = value + 'px';
                }
                break;
            case 'width':
                entry.style.width = value + 'px';
                if (typeof func !== "undefined") {
                    func(null,value);
                }
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col.$/.test(name)).length != 0) {
                    entry.querySelector('.input').style.width = value - 4 + 'px';
                    entry.querySelector('#cover').style.width = value + 'px';
                }
                break;
            case 'marginLeft':
                entry.style.marginLeft = value + 'px';
                break;
        }
    });
}

function loadedSheet(loadedSheet) {
    return (
        <div id='content'>
        </div>
    );
}

const defaultSheet = (rows, defaultHeight, cols, defaultWidth) => {
    newSheet = true;
    let topAxis = []; // Top Axis Row
    topAxis.push(<div className='row0 col0 AxisX' style={{ height: `${defaultHeight}px`, width: `${defaultWidth / 2}px` }}>&nbsp;</div>)
    for (let i = 0; i < cols; ++i) {
        let letter = alphabet[i < 26 ? i : i % 26];
        topAxis.push(<div className={`row0 col${i + 1} AxisX`} style={{ height: `${defaultHeight}px`, width: `${defaultWidth}px`, marginLeft: `${defaultWidth * i + defaultWidth / 2}px` }}><p>{letter}</p></div>)
    }

    let rowsArr = []; // Remaining Rows
    for (let i = 0; i < rows; ++i) {
        let row = [];
        row.push(<div className={`row${i + 1} AxisY col0`} style={{ height: `${defaultHeight}px`, width: `${defaultWidth / 2}px` }}>
            <p>{i + 1}</p>
        </div>);
        for (let j = 1; j < cols + 1; ++j) {
            row.push(<div className={`row${i + 1} col${j} entry`} style={{ height: `${defaultHeight}px`, width: `${defaultWidth}px`, marginLeft: `${defaultWidth * (j - 1) + defaultWidth / 2}px` }}><input onBlur={showCoverEvent} onKeyUp={stopPropagation} onKeyDown={stopPropagation} className='input' type='text' style={{ height: `${defaultHeight - 4}px`, width: `${defaultWidth - 4}px`, border: 'none' }}></input><div id='cover' tabIndex='-1' onClickCapture={selectCell} onBlur={unselectCell} onDoubleClickCapture={hideCoverEvent} style={{ position: 'absolute', left: '0', top: '0', height: `${defaultHeight}px`, width: `${defaultWidth}px`, border: 'none' }}></div></div>)
        }
        rowsArr.push(row);
    }

    let table = []; // Combine Rows
    table.push(<div id='row0' className='row0' style={{ display: 'flex', flexDirection: 'row', height: `${defaultHeight}px`, width: `${defaultWidth * cols + defaultWidth / 2}px` }}>{topAxis}</div>);
    for (let j = 0; j < rowsArr.length; ++j) {
        table.push(<div id={`row${j + 1}`} className={`row${j + 1}`} style={{ display: 'flex', flexDirection: 'row', height: `${defaultHeight}px`, width: `${defaultWidth * cols + defaultWidth / 2}px` }}>
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
    e.target.parentElement.querySelector('.input').focus();
}

function showCoverEvent(e) {
    e.target.parentElement.querySelector('#cover').style.zIndex = 1;
}