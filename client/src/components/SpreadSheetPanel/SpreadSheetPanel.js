import React from 'react';
import { loadedSheet, defaultSheet } from './core/serverCalls/loadTable/getSheet.js'
import { applyResizers } from './handlers/resizingHandler/resizingHandler.js'
import applyTextChangeHandlers from './handlers/textChangeHandler.js';
import applySelectedHandler from './handlers/selectedHandler.js';
import { recordChange } from './core/history/newInteraction/recordChange.js';
import { undo, redo } from './core/history/traverseHistory/undoRedo.js'
import { unitTest } from './tests/endToEnd.js';

const NOCOMMAND = 0;
const CONTROL = 1;
const SHIFT = 2;

class SpreadSheetPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            table: defaultSheet(parseInt(this.props.rows), parseInt(this.props.cols), parseInt(this.props.defaultRowHeight), parseInt(this.props.defaultColWidth)),
            keyEventState: NOCOMMAND,
            sheetID: '',
        }
        this.getSheetDimensions = this.getSheetDimensions.bind(this);
        this.setSheetDimensions = this.setSheetDimensions.bind(this);
        this.getChangeHistoryAndIndex = this.getChangeHistoryAndIndex.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.keyUpped = this.keyUpped.bind(this);
        this.autoSave = this.autoSave.bind(this);

        // imported
        this.recordChange = recordChange.bind(this);
        this.undo = undo.bind(this);
        this.redo = redo.bind(this);
    }
    componentDidMount() {
        console.log(this.props);
        applyResizers([this.getSheetDimensions, this.setSheetDimensions, this.recordChange]); // resizers.js
        applyTextChangeHandlers(this.recordChange);
        applySelectedHandler(this.state.keyEventState, this.state.getSelected, this.state.setSelected);
        if (this.props.whichTests.length != 0) unitTest(this.props.whichTests, this.getSheetDimensions, this.getChangeHistoryAndIndex);
        this.autoSave();
    }
    render() {
        return (
            <div className="content" id="contentID" style={{ height: window.innerHeight * .95, width: '100%' }}>
                {/*<FormatPanel />*/}
                <div id='spreadsheet' tabIndex='-1' onKeyDown={this.keyPressed} onKeyUp={this.keyUpped} style={{ height: `${this.props.tableHeight}px`, width: `${this.props.tableWidth}px` }}>
                    {this.state.table}
                </div>
            </div>
        );
    }
    getSheetDimensions() {
        return [this.props.tableHeight, this.props.tableWidth];
    }
    setSheetDimensions(height, width) {
        if (height === null) height = this.props.tableHeight;
        if (width === null) width = this.props.tableWidth;
        this.props.updateSheetDimensions(height, width);
    }
    getChangeHistoryAndIndex() {
        return [this.props.changeHistory, this.props.changeHistoryIndex];
    }
    setSelected(entries) {
        this.props.updateSelected(entries);
    }
    // Handle CTRL+Z/Y (undo/redo) and CTRL/SHIFT selections.
    keyPressed(e) {
        switch (this.state.keyEventState) {
            case NOCOMMAND:
                if (e.key === 'Control' || e.key === 'Meta') {
                    //console.log('Control');
                    this.setState({ keyEventState: CONTROL });
                } else if (e.key === 'Shift') {
                    //console.log('Shift');
                    this.setState({ keyEventState: SHIFT });
                }
                break;
            case CONTROL:
                if (e.key === 'z') {
                    this.undo();
                } else if (e.key === 'y') {
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
                //console.log('NO COMMAND UP');
                break;
            case CONTROL:
            case SHIFT:
                if (e.key === 'Control' || e.key === 'Meta' || e.key === 'Shift') {
                    //console.log('CTRL/SHIFT UP');
                    this.setState({ keyEventState: NOCOMMAND });
                }
                break;
        }
    }
    autoSave() {
        let timer;
        if (this.props.visibleSheet) {
            timer = setInterval(() => {
                console.log('autoSave()');
                if ([...this.props.collectedData.getEntries()].length != 0) {
                    console.log(this.props.collectedData);
                    console.log(this.props.sentData);
                    console.log('creds: '+this.props.user + ' '+this.props.pass);
                    this.saveAPI()
                        .then(res => console.log('saveStatus: ' + res.saveStatus))
                        .catch(err => {
                            console.log('saveError: ' + err);
                            clearInterval(timer);
                        });
                    this.props.save();
                    console.log('saved');
                    console.log(this.props.sentData);
                }
            }, 5000);
        } else {
            clearInterval(timer);
        }
    }
    saveAPI = async () => {
        const response = await fetch('/sheet/save/' + this.props.user + '/' + this.props.pass+'/'+this.state.sheetID, {
            method: "POST",
            body: JSON.stringify({
                token: this.state.sessionToken,
                collectedData: this.props.collectedData
            }),
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };
}
export default SpreadSheetPanel;