class SpreadSheet {
    constructor(styleMap) {
        this.styleMap = styleMap;
    }
    putStyle(property, value) {
        this.styleMap.set(property, value);
    }
    getStyleMap() {
        return this.styleMap;
    }
}

class Row {
    constructor(row, styleMap) {
        this.row = row;
        this.styleMap = styleMap;
    }
    putStyle(property, value) {
        this.styleMap.set(property, value);
    }
    getStyleMap() {
        return this.styleMap;
    }
}

class Cell {
    constructor(row, col, val, styleMap) {
        this.cellRow = row;
        this.cellCol = col;
        this.val = val;
        this.styleMap = styleMap;
    }
    putStyle(property, value) {
        this.styleMap.set(property, value);
    }
    getStyleMap() {
        return this.styleMap;
    }
}

class Data {
    constructor() {
        this.entries = new Map();
    }
    setEntry(entryKey, styleMap, row, col, val) {
        this.entries.set(entryKey,
            entryKey == 'spreadsheet' ? new SpreadSheet(styleMap) :
            !/.col./.test(entryKey) ? new Row(row, styleMap) :
            new Cell(row, col, val, styleMap)
        );
    }
    hasEntry(entryKey) {
        return this.entries.has(entryKey);
    }
    getEntry(entryKey) {
        return this.entries.get(entryKey);
    }
    getEntries() {
        return this.entries.entries();
    }
}

export default Data;