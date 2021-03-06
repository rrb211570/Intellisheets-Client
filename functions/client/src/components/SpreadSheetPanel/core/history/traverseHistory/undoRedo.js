import { updateSheetDimensions, applyChange, applyGroupChange} from './applyChange.js';
import updateCollectedData from '../../serverCalls/autoSave/updateCollectedData';

function undo() {
    if (this.props.changeHistoryIndex > 0) {
        let updatedCollectedData = this.props.collectedData;
        for (const [entryKey, data] of this.props.changeHistory[this.props.changeHistoryIndex - 1].getIndividualEntries()) {
            if (entryKey == 'spreadsheet') updateSheetDimensions(data.getStyleMap(), this.setSheetDimensions);
            else if (!/\.col\d+/.test(entryKey)) {
                let entry = document.getElementById(entryKey.match(/\.row\d+/));
                applyChange(entry, data.getStyleMap());
            } else {
                let entry = document.querySelector(entryKey.match(/\.row\d+\.col\d+$/));
                applyChange(entry, data.getStyleMap(), data.getVal());
            }
        }
        for(const [group, styleMap] of this.props.changeHistory[this.props.changeHistoryIndex - 1].getGroupEntries()){
            applyGroupChange(group, styleMap);
        }
        updatedCollectedData = updateCollectedData(this.props.changeHistory[this.props.changeHistoryIndex - 1], this.props.collectedData);
        console.log('Undo\nchangeHistoryIndex: ' + (this.props.changeHistoryIndex - 1));
        this.props.undo(updatedCollectedData);
        console.log(this.props.changeHistory);
    }
}
function redo() {
    if (this.props.changeHistoryIndex < this.props.changeHistory.length - 1) {
        let updatedCollectedData = this.props.collectedData;
        for (const [entryKey, data] of this.props.changeHistory[this.props.changeHistoryIndex + 1].getIndividualEntries()) {
            if (entryKey == 'spreadsheet') {
                updateSheetDimensions(data.getStyleMap(), this.setSheetDimensions);
            } else if (!/\.col\d+/.test(entryKey)) {
                let entry = document.getElementById(entryKey.match(/\.row\d+$/));
                applyChange(entry, data.getStyleMap());
            } else {
                let entry = document.querySelector(entryKey.match(/\.row\d+\.col\d+$/));
                applyChange(entry, data.getStyleMap(), data.getVal())
            }
        }
        for(const [group, styleMap] of this.props.changeHistory[this.props.changeHistoryIndex + 1].getGroupEntries()){
            applyGroupChange(group, styleMap);
        }
        updatedCollectedData = updateCollectedData(this.props.changeHistory[this.props.changeHistoryIndex + 1], this.props.collectedData);
        console.log('Redo\nchangeHistoryIndex: ' + (this.props.changeHistoryIndex + 1));
        this.props.redo(updatedCollectedData);
        console.log(this.props.changeHistory);
    }
}
export {undo, redo}