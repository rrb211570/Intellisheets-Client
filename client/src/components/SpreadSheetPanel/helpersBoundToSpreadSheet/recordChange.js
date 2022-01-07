import { getRowNum, getColNum, getEntryKey } from '../helpers/misc.js'
import Data from '../helpers/data.js';

function recordChange(entries) {
    let prevData = new Data();
    let newData = new Data();
    let updatedCollectedData = this.state.collectedData;
    this.incorporateNewData(entries,prevData,newData,updatedCollectedData);
    this.setState({
        changeHistory: [...this.state.changeHistory.slice(0, this.state.changeHistoryIndex), prevData, newData],
        changeHistoryIndex: this.state.changeHistoryIndex + 1,
        collectedData: updatedCollectedData
    });
}
function incorporateNewData(entries,prevData,newData,updatedCollectedData){
    for (const [rowClass, colClass, [prevVal, prevStyleMap], [newVal, newStyleMap]] of entries) {
        let prevStyles = new Map();
        let newStyles = new Map();
        let rowNum = getRowNum(rowClass);
        let colNum = getColNum(colClass);
        let entryKey = getEntryKey(rowClass, colClass);
        if (this.currentHistoryStateHasEntry(entryKey)) {
            this.getStyleMapOfEntry_CurrentHistoryState(entryKey, prevStyles)
        }
        for (const [property, val] of prevStyleMap) prevStyles.set(property, val);
        for (const [property, val] of newStyleMap) newStyles.set(property, val);
        prevData.setEntry(entryKey, prevStyles, rowNum, colNum, prevVal);
        newData.setEntry(entryKey, newStyles, rowNum, colNum, newVal);

        this.updateCollectedData(updatedCollectedData, entryKey, newStyles.entries(), rowNum, colNum, newVal);
    }
    for (const [entry, data] of this.state.changeHistory[this.state.changeHistoryIndex].getEntries()) {
        if (!prevData.hasEntry(entry)) prevData.setEntry(entry, data.styleMap, data.cellRow, data.cellCol, data.val);
    }
}
function currentHistoryStateHasEntry(entryKey){
    return this.state.changeHistory[this.state.changeHistoryIndex].hasEntry(entryKey);
}
function getStyleMapOfEntry_CurrentHistoryState(entryKey, prevStyles){
    prevStyles = this.state.changeHistory[this.state.changeHistoryIndex].getEntry(entryKey).getStyleMap();
}
function updateCollectedData(updatedCollectedData, entryKey, styleChanges, rowNum, colNum, val) {
    let styleMap = new Map();
    if (this.state.collectedData.hasEntry(entryKey)) {
        styleMap = this.state.collectedData.getEntry(entryKey).getStyleMap();
    }
    for (const [property, value] of styleChanges) {
        styleMap.set(property, value)
    }
    updatedCollectedData.setEntry(entryKey, styleMap, rowNum, colNum, val);
}

export {recordChange,incorporateNewData,currentHistoryStateHasEntry,getStyleMapOfEntry_CurrentHistoryState,updateCollectedData};