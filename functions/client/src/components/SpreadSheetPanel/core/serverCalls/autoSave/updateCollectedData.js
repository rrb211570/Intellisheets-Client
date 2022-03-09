import Data from '../../history/data.js';

function updateCollectedData(dataAfterChange, prevCollectedData) {
    let updatedCollectedData = new Data();
    for (const [entryKey, data] of dataAfterChange.getIndividualEntries()) {
        let styleMap = new Map();
        if (prevCollectedData.hasIndividualEntry(entryKey)) {
            styleMap = prevCollectedData.getIndividualEntry(entryKey).getStyleMap();
        }
        for (const [property, val] of data.getStyleMap().entries()) styleMap.set(property, val);
        let args = [entryKey, styleMap];
        if (entryKey != 'spreadsheet' && !/\.col\d+/.test(entryKey)) args.push(data.getRow());
        if (/\.col\d+/.test(entryKey)) {
            args.push(data.getCellRow(), data.getCellCol());
            if (prevCollectedData.hasIndividualEntry(entryKey)) args.push(prevData.getIndividualEntry(entryKey).getVal());
            else args.push(data.getVal());
        }
        updatedCollectedData.setIndividualEntry(...args);
    }
    for (const [entryKey, data] of prevCollectedData.getIndividualEntries()) {
        let args = [entryKey, data.getStyleMap()];
        if (entryKey != 'spreadsheet' && !/\.col\d+/.test(entryKey)) args.push(data.getRow());
        if (/\.col\d+/.test(entryKey)) args.push(data.getCellRow(), data.getCellCol(), data.getVal());
        if (!updatedCollectedData.hasIndividualEntry(entryKey)) updatedCollectedData.setIndividualEntry(...args)
    }
    // group entries
    for (const [group, styleMap] of dataAfterChange.getGroupEntries()) {
        let updatedStyleMap = new Map();
        if (prevCollectedData.hasGroup(group)) {
            updatedStyleMap = prevCollectedData.getGroup(group);
        }
        for (const [property, val] of styleMap.entries()) updatedStyleMap.set(property, val);
        updatedCollectedData.setGroup(group, updatedStyleMap);
    }
    for (const [group, styleMap] of prevCollectedData.getGroupEntries()) {
        if (!updatedCollectedData.hasGroup(group)) updatedCollectedData.setGroup(group, styleMap)
    }
    return updatedCollectedData;
}
export default updateCollectedData;