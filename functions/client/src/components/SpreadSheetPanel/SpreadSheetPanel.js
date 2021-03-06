import React from 'react';
import { loadSheet } from './core/serverCalls/loadTable/loadSheet.js'
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
            table: <div></div>,
            keyEventState: NOCOMMAND,
            sheetID: '',
        }
        this.getSheetDimensions = this.getSheetDimensions.bind(this);
        this.setSheetDimensions = this.setSheetDimensions.bind(this);
        this.getChangeHistoryAndIndex = this.getChangeHistoryAndIndex.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.keyUpped = this.keyUpped.bind(this);

        // imported
        this.recordChange = recordChange.bind(this);
        this.undo = undo.bind(this);
        this.redo = redo.bind(this);
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
    componentDidMount() {
        console.log(this.props);
        let flag = 0;
        let timer = setInterval(() => {
            if (flag == 0) {
                if (this.props.loadedSheet != null) {
                    try{
                        this.setState({
                            table: loadSheet(this.props.loadedSheet, parseInt(this.props.rows), parseInt(this.props.cols), parseInt(this.props.rowHeight), parseInt(this.props.colWidth))
                        });
                        console.log('loading complete');
                    } catch(e){
                        console.log(e);
                        clearInterval(timer);
                    }
                    flag = 1;
                }
            } else if (flag == 1) {
                applyResizers([this.getSheetDimensions, this.setSheetDimensions, this.recordChange]); // resizers.js
                applyTextChangeHandlers(this.recordChange);
                applySelectedHandler(this.state.keyEventState, this.state.getSelected, this.state.setSelected);
                if (this.props.whichTests.length != 0) unitTest(this.props.whichTests, this.getSheetDimensions, this.getChangeHistoryAndIndex);
                clearInterval(timer);
            }
        }, 1000)
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
}
export default SpreadSheetPanel;