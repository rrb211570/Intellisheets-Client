import Data from '../../history/data.js';

function updateCollectedData(dataAfterChange, prevCollectedData) {
    let updatedCollectedData = new Data();
    for (const [entryKey, data] of dataAfterChange.getEntries()) {
        let styleMap = new Map();
        if (prevCollectedData.hasEntry(entryKey)) {
            styleMap = prevCollectedData.getEntry(entryKey).getStyleMap();
        }
        for (const [property, val] of data.getStyleMap().entries()) styleMap.set(property, val);
        let args = [entryKey, styleMap];
        if (entryKey != 'spreadsheet'&&!/.col./.test(entryKey)) args.push(data.getRow());
        if (/.col./.test(entryKey)) args.push(data.getCellRow(), data.getCellCol(), data.getVal());
        updatedCollectedData.setEntry(...args);
    }
    for (const [entryKey, data] of prevCollectedData.getEntries()) {
        let args = [entryKey, data.getStyleMap()];
        if (entryKey != 'spreadsheet'&&!/.col./.test(entryKey)) args.push(data.getRow());
        if (/.col./.test(entryKey)) args.push(data.getCellRow(), data.getCellCol(), data.getVal());
        if (!updatedCollectedData.hasEntry(entryKey)) updatedCollectedData.setEntry(...args)
    }
    return updatedCollectedData;
}
export default updateCollectedData;