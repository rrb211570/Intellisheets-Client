import React from 'react';
import applyResizers from './resizers.js'

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let newSheet = false;

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
            changeHistory: []
        }
        this.setSheetDimensions = this.setSheetDimensions.bind(this);
        this.getSheetDimensions = this.getSheetDimensions.bind(this);
        this.setTable = this.setTable.bind(this);
    }
    componentDidMount() {
        let borderWidth = 2;
        let height = [...document.getElementsByClassName('col0')].reduce(
            (sum, entry) => sum + parseInt(entry.style.height), 0) + 2 * borderWidth;
        let width = parseInt(document.getElementById('row0').style.width) + 2 * borderWidth;
        this.setSheetDimensions(height, width);
        applyResizers(height, width, this.getSheetDimensions, this.setSheetDimensions, this.setTable); // util.js function
    }
    setSheetDimensions(height, width) {
        this.setState({
            tableHeight: height,
            tableWidth: width
        })
    }
    getSheetDimensions() {
        return [this.state.tableHeight, this.state.tableWidth];
    }
    setTable() {
        return this.state.table;
    }
    render() {
        return (
            <div className="content" id="contentID" style={{ height: this.props.outerHeight + 'px', width: this.props.outerWidth + 'px' }}>
                <div id='spreadsheet' key='eh' style={{ height: `${this.state.tableHeight}px`, width: `${this.state.tableWidth}px`, border: '1px solid black' }}>
                    {this.state.table}
                </div>
            </div>
        );
    }
}
export default SpreadSheetPanel;

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
            row.push(<div className={`row${i + 1} col${j} entry`} style={{ height: `${defaultHeight}px`, width: `${defaultWidth}px`, marginLeft: `${defaultWidth * (j - 1) + defaultWidth / 2}px` }}><input className='input' type='text' style={{ height: `${defaultHeight-4}px`, width: `${defaultWidth-4}px`, border: 'none'}}></input></div>)
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