import React from 'react';
import FormatPanel from '../FormatPanel.js'
import { loadedSheet, defaultSheet } from './helpers/getSheet.js'
import applyResizers from './handlers/resizingHandler/resizingHandler.js'
import applyTextChangeHandlers from './handlers/textChangeHandler.js';
import applySelectedHandler from './handlers/selectedHandler.js';
import { updateSheetDimensions, applyChange } from './helpers/applyChange.js'
import { recordChange, incorporateNewData, currentHistoryStateHasEntry, getStyleMapOfEntry_CurrentHistoryState, updateCollectedData } from './helpersBoundToSpreadSheet/recordChange.js'
import Data from './helpers/data.js';
import unitTest from './testing/unitTest.js';

const NOCOMMAND = 0;
const CONTROL = 1;
const SHIFT = 2;

class SpreadSheetPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHeight: (parseInt(this.props.rows,10) +1) * this.props.defaultRowHeight,
            tableWidth: (this.props.cols * this.props.defaultColWidth) + (this.props.defaultColWidth / 2),
            table: this.props.loadedSheet.length !== 0 ?
                loadedSheet(this.props.loadedSheet) :
                defaultSheet(parseInt(this.props.rows), parseInt(this.props.defaultRowHeight), parseInt(this.props.cols), parseInt(this.props.defaultColWidth)),
            selectedEntries: [],
            keyEventState: NOCOMMAND,
            changeHistory: [new Data()],
            changeHistoryIndex: 0,
            collectedData: new Data(),
            sentData: new Data(),
            serverTest: 'blah',
            loadedSheet: ''
        }
        this.getSheetDimensions = this.getSheetDimensions.bind(this);
        this.setSheetDimensions = this.setSheetDimensions.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.recordChange = recordChange.bind(this);
        this.incorporateNewData = incorporateNewData.bind(this);
        this.currentHistoryStateHasEntry = currentHistoryStateHasEntry.bind(this);
        this.getStyleMapOfEntry_CurrentHistoryState = getStyleMapOfEntry_CurrentHistoryState.bind(this);
        this.updateCollectedData = updateCollectedData.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.keyUpped = this.keyUpped.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = redo.bind(this);
    }
    render() {
        return (
            <div className="content" id="contentID" style={{ height: window.innerHeight * .95, width: '100%' }}>
                {/*<FormatPanel />*/}
                <div>{this.state.serverTest}</div>
                <div>{this.state.loadedSheet}</div>
                <div id='spreadsheet' tabIndex='-1' onKeyDown={this.keyPressed} onKeyUp={this.keyUpped} style={{ height: `${this.state.tableHeight}px`, width: `${this.state.tableWidth}px`, border: '1px solid black' }}>
                    {this.state.table}
                </div>
            </div>
        );
    }
    componentDidMount() {
        let height = [...document.getElementsByClassName('col0')].reduce(
            (sum, entry) => sum + parseInt(entry.style.height), 0);
        let width = parseInt(document.getElementById('row0').style.width);
        applyResizers(height, width, this.getSheetDimensions, this.setSheetDimensions, this.recordChange); // resizers.js
        applyTextChangeHandlers(this.recordChange);
        applySelectedHandler(this.state.keyEventState, this.state.getSelected, this.state.setSelected);
        /*this.callBackendAPI()
            .then(res => this.setState({ serverTest: res.express }))
            .catch(err => console.log(err));
        this.callSheetLoaderAPI()
            .then(res => this.setState({ loadedSheet: [res.username, res._id, res.sheets] }))
            .catch(err => console.log(err));*/
        if (this.props.whichTests.length != 0) unitTest(this.props.whichTests);
    }
    callBackendAPI = async () => {
        const response = await fetch('/express_backend');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };
    callSheetLoaderAPI = async () => {
        const response = await fetch('/api/users', {
            method: "POST",
            body: JSON.stringify({
                username: 'Rocky'
            }),
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    getSheetDimensions() {
        return [this.state.tableHeight, this.state.tableWidth];
    }
    setSheetDimensions(height, width) {
        this.setState((prevState) => {
            if (height === null) height = prevState.tableHeight;
            if (width === null) width = prevState.tableWidth;
            return {
                tableHeight: height,
                tableWidth: width
            }
        });
    }
    getSelected() {
        return this.state.selectedEntries;
    }
    setSelected(selected) {
        this.setState({ selectedEntries: selected });
    }
    // Handle CTRL+Z/Y (undo/redo) and CTRL/SHIFT selections.
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
            let updatedCollectedData = this.state.collectedData;
            for (const [entryKey, data] of this.state.changeHistory[this.state.changeHistoryIndex - 1].getEntries()) {
                if (entryKey == 'spreadsheet') {
                    updateSheetDimensions(data.styleMap, this.setSheetDimensions);
                    this.updateCollectedData(updatedCollectedData, entryKey, data.styleMap);
                } else if (!/.col./.test(entryKey)) {
                    let entry = document.getElementById(entryKey.match(/row./));
                    applyChange(entry, data.val, data.styleMap);
                    this.updateCollectedData(updatedCollectedData, entryKey, data.styleMap);
                } else {
                    let entry = document.querySelector(entryKey.match(/\.row.\.col.$/));
                    applyChange(entry, data.val, data.styleMap);
                    this.updateCollectedData(updatedCollectedData, entryKey, data.styleMap, data.cellRow, data.cellCol, data.val);
                }
            }
            this.setState((prevState) => ({
                changeHistoryIndex: prevState.changeHistoryIndex - 1,
                collectedData: updatedCollectedData
            }));
        }
    }
}
function redo() {
    console.log('Redo');
    if (this.state.changeHistoryIndex < this.state.changeHistory.length - 1) {
        let updatedCollectedData = this.state.collectedData;
        for (const [entryKey, data] of this.state.changeHistory[this.state.changeHistoryIndex + 1].getEntries()) {
            if (entryKey == 'spreadsheet') {
                updateSheetDimensions(data.styleMap, this.setSheetDimensions);
                this.updateCollectedData(updatedCollectedData, entryKey, data.styleMap, null, null, null);
            } else if (!/.col./.test(entryKey)) {
                let entry = document.getElementById(entryKey.match(/row.$/));
                applyChange(entry, data.val, data.styleMap);
                this.updateCollectedData(updatedCollectedData, entryKey, data.styleMap, data.cellRow, null, null);
            } else {
                let entry = document.querySelector(entryKey.match(/\.row.\.col.$/));
                applyChange(entry, data.val, data.styleMap);
                this.updateCollectedData(updatedCollectedData, entryKey, data.styleMap, data.cellRow, data.cellCol, data.val);
            }
        }
        this.setState((prevState) => ({
            changeHistoryIndex: prevState.changeHistoryIndex + 1,
            collectedData: updatedCollectedData
        }));
    }
}
export default SpreadSheetPanel;