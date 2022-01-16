import Data from '../data.js';
import updateCollectedData from '../../serverCalls/autoSave/updateCollectedData.js';

function recordChange(dataBeforeChange, dataAfterChange) {
    console.log(this.props.collectedData);
    let prevRecordedData = updatePrevRecordedData(dataBeforeChange,this.props.changeHistory[this.props.changeHistoryIndex]);
    this.props.newHistoryState(prevRecordedData, dataAfterChange,updateCollectedData(dataAfterChange, this.props.collectedData));
    console.log('changeHistoryIndex: '+this.props.changeHistoryIndex);
}
function updatePrevRecordedData(dataBeforeChange, prevData) {
    let updatedPrevData = new Data();
    for (const [entryKey, data] of dataBeforeChange.getEntries()) {
        let styleMap = new Map();
        if (prevData.hasEntry(entryKey)) {
            styleMap = prevData.getEntry(entryKey).getStyleMap();
        }
        for (const [property, val] of data.getStyleMap().entries()) styleMap.set(property, val);
        let args = [entryKey, styleMap];
        if (entryKey != 'spreadsheet'&&!/.col./.test(entryKey)) args.push(data.getRow());
        if (/.col./.test(entryKey)) args.push(data.getCellRow(), data.getCellCol(), data.getVal());
        updatedPrevData.setEntry(...args);
    }
    for (const [entryKey, data] of prevData.getEntries()) {
        let args = [entryKey, data.getStyleMap()];
        if (entryKey != 'spreadsheet'&&!/.col./.test(entryKey)) args.push(data.getRow());
        if (/.col./.test(entryKey)) args.push(data.getCellRow(), data.getCellCol(), data.getVal());
        if (!updatedPrevData.hasEntry(entryKey)) updatedPrevData.setEntry(...args);
    }
    return updatedPrevData;
}

export { recordChange, updateCollectedData};