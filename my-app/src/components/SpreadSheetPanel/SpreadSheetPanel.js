import React from 'react';
import applyResizers from './resizers.js'
import defaultSheet from './defaultSheet.js'

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
            tableHeight: height !== null ? height : this.state.tableHeight,
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
        console.log(entries);
        let prevState = new Map();
        let newState = new Map();
        entries.forEach((entry) => {
            let prevEntryStyle = new Map();
            let newEntryStyle = new Map();
            if (this.state.changeHistory[this.state.changeHistoryIndex].has(`${entry[0]}${entry[1]}`)) {
                let thing = this.state.changeHistory[this.state.changeHistoryIndex].get(`${entry[0]}${entry[1]}`);
                for (const [key, value] of thing[1].entries()) {
                    prevEntryStyle.set(key, value);
                }
            }
            entry[2][1].forEach(stylePair => prevEntryStyle.set(stylePair[0], stylePair[1]));
            entry[3][1].forEach(stylePair => newEntryStyle.set(stylePair[0], stylePair[1]));
            prevState.set(`${entry[0]}${entry[1]}`, [entry[2][0], prevEntryStyle]);
            newState.set(`${entry[0]}${entry[1]}`, [entry[3][0], newEntryStyle]);
        });
        for (const [key, val] of this.state.changeHistory[this.state.changeHistoryIndex].entries()) {
            if (!prevState.has(key)) prevState.set(key, val);
        }
        this.setState({
            changeHistory: [...this.state.changeHistory.slice(0, this.state.changeHistoryIndex),prevState,newState],
            changeHistoryIndex: this.state.changeHistoryIndex + 1,
        });
        console.log(this.state.changeHistoryIndex);
        console.log(this.state.changeHistory);
    }
    keyPressed(e) {
        switch (this.state.keyEventState) {
            case NOCOMMAND:
                if (e.key == 'Control') {
                    console.log('Control');
                    this.setState({ keyEventState: CONTROL });
                } else if (e.key == 'Shift') {
                    console.log('Shift');
                    this.setState({ keyEventState: SHIFT });
                }
                break;
            case CONTROL:
                if (e.key == 'z') {
                    this.undo();
                } else if (e.key == 'y') {
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
        if (this.state.changeHistoryIndex < this.state.changeHistory.length - 1) {
            //this.setState({changeHistoryIndex: this.state.changeHistoryIndex+1});
            for (const [key, value] of this.state.changeHistory[this.state.changeHistoryIndex + 1].entries()) {
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
            this.setState({ changeHistoryIndex: this.state.changeHistoryIndex + 1 });
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

function applyState(entry, styleArr, setSheetDimensions) {
    if (styleArr[0] != null) entry.value = styleArr[0];
    for (const [property, value] of styleArr[1].entries()) {
        if (typeof setSheetDimensions !== "undefined") {
            if(property=='height') setSheetDimensions(value, null);
            else setSheetDimensions(null, value);
            continue;
        }
        switch (property) {
            case 'height':
                entry.style.height = value + 'px';
                if([...entry.classList].filter(name => /^col0$/.test(name)).length != 0){
                    console.log('numAxis');
                    entry.style.lineHeight = value + 'px';
                }
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col.$/.test(name)).length != 0) {
                    entry.querySelector('.input').style.height = value - 4 + 'px';
                    entry.querySelector('#cover').style.height = value + 'px';
                }
                break;
            case 'width':
                entry.style.width = value + 'px';
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
    }
}

function loadedSheet(loadedSheet) {
    return (
        <div id='content'>
        </div>
    );
}

