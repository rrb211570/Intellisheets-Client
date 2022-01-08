import Data from '../helpers/data.js';

function recordChange(dataBeforeChange, dataAfterChange) {
    let prevRecordedData = this.updatePrevRecordedData(dataBeforeChange);
    let collectedData = this.updateCollectedData(dataAfterChange);
    this.setState({
        changeHistory: [...this.state.changeHistory.slice(0, this.state.changeHistoryIndex), prevRecordedData, dataAfterChange],
        changeHistoryIndex: this.state.changeHistoryIndex + 1,
        collectedData: collectedData
    });
    console.log(this.state.changeHistory);
    console.log(this.state.changeHistoryIndex);
}
function updatePrevRecordedData(dataBeforeChange) {
    let updatedPrevData = new Data();
    for (const [entryKey, data] of dataBeforeChange.getEntries()) {
        let styleMap = new Map();
        if (this.currentHistoryStateHasEntry(entryKey)) {
            styleMap = this.getCurrentHistoryStateEntry(entryKey).getStyleMap();
        }
        for (const [property, val] of data.getStyleMap().entries()) styleMap.set(property, val);
        updatedPrevData.setEntry(entryKey, styleMap, data.cellRow, data.cellCol, data.val);
    }
    for (const [entryKey, data] of this.state.changeHistory[this.state.changeHistoryIndex].getEntries()) {
        if (!updatedPrevData.hasEntry(entryKey)) updatedPrevData.setEntry(entryKey, data.styleMap, data.cellRow, data.cellCol, data.val);
    }
    return updatedPrevData;
}
function currentHistoryStateHasEntry(entryKey) {
    return this.state.changeHistory[this.state.changeHistoryIndex].hasEntry(entryKey);
}
function getCurrentHistoryStateEntry(entryKey) {
    return this.state.changeHistory[this.state.changeHistoryIndex].getEntry(entryKey);
}
function updateCollectedData(dataAfterChange) {
    let updatedCollectedData = new Data();
    for (const [entryKey, data] of dataAfterChange.getEntries()) {
        let styleMap = new Map();
        if (this.state.collectedData.hasEntry(entryKey)) {
            styleMap = this.state.collectedData.getEntry(entryKey).getStyleMap();
        }
        for (const [property, val] of data.getStyleMap().entries()) styleMap.set(property, val);
        updatedCollectedData.setEntry(entryKey, styleMap, data.cellRow, data.cellCol, data.val);
    }
    for(const [entryKey, data] of this.state.collectedData.getEntries()){
        if(!updatedCollectedData.hasEntry(entryKey)) updatedCollectedData.setEntry(entryKey, data.styleMap, data.cellRow, data.cellCol, data.val)
    }
    return updatedCollectedData;
}

export { recordChange, updatePrevRecordedData, currentHistoryStateHasEntry, getCurrentHistoryStateEntry, updateCollectedData };