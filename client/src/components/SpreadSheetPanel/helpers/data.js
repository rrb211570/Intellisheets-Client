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
    constructor(styleMap, row) {
        this.styleMap = styleMap;
        this.row = row;
    }
    putStyle(property, value) {
        this.styleMap.set(property, value);
    }
    getStyleMap() {
        return this.styleMap;
    }
}

class Cell {
    constructor(styleMap, row, col, val) {
        this.styleMap = styleMap;
        this.cellRow = row;
        this.cellCol = col;
        this.val = val;
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
            !/.col./.test(entryKey) ? new Row(styleMap, row) :
            new Cell(styleMap, row, col, val)
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
    clear(){
        this.entries.clear();
    }
}

export default Data;