class SpreadSheet {
    #styleMap;
    constructor(styleMap) {
        if (!(styleMap instanceof Map)) throw 'Data:SpreadSheet: styleMap param must be a Map()'
        for (const [property, value] of styleMap.entries()) {
            if (property == 'height' || property == 'width') {
                if (isNaN(parseInt(value, 10)) || parseInt(value, 10) !== value) throw 'Data:SpreadSheet:constructor:styleMap: value of height/width must be valid num';
            } else throw 'Data:SpreadSheet:constructor:styleMap: found invalid property' + property;
        }
        this.#styleMap = styleMap;
    }
    getStyleMap() {
        return this.#styleMap;
    }
    putStyle(property, value) {
        if (property === null || property === undefined || value === null || value === undefined) throw 'Data:SpreadSheet:putStyle: property or value is null/undefined';
        if (property == 'width' || property == 'height') {
            if (isNaN(parseInt(value, 10)) || parseInt(value, 10) != value) throw 'Data:SpreadSheet:putStyle: value for height/width must be valid num';
        } else throw 'Data:SpreadSheet:putStyle: found invalid property' + property;
        this.#styleMap.set(property, value);
    }
    setStyleMap(styleMap) {
        if (!(styleMap instanceof Map)) throw 'Data:SpreadSheet: styleMap param must be a Map()';
        this.#styleMap = styleMap;
    }
    clearStyleMap() {
        this.#styleMap.clear();
    }
}

class Row {
    #styleMap;
    #row;
    constructor(styleMap, row) {
        if (!(styleMap instanceof Map)) throw 'Data:Row:constructor: styleMap param must be a Map()';
        for (const [property, value] of styleMap.entries()) {
            if (property == 'height') {
                if (isNaN(parseInt(value, 10)) || parseInt(value, 10) !== value) throw 'Data:Row:constructor:styleMap: value of height must be valid num';
            } else throw 'Data:Row:constructor:styleMap: found invalid property' + property;
        }
        if (isNaN(parseInt(row, 10)) || parseInt(row, 10) !== row) throw 'Data:Row:constructor: row param must be valid num';
        this.#styleMap = styleMap;
        this.#row = row;
    }
    getStyleMap() {
        return this.#styleMap;
    }
    getRow(){
        return this.#row;
    }
    putStyle(property, value) {
        if (property === null || property === undefined || value === null || value === undefined) throw 'Data:Row:putStyle: property or value is null/undefined';
        if (property == 'height') {
            if (isNaN(parseInt(value, 10)) || parseInt(value, 10) != value) throw 'Data:Row:putStyle: value for height must be valid num';
        } else throw 'Data:Row:putStyle: found invalid property' + property;
        this.#styleMap.set(property, value);
    }
    setStyleMap(styleMap) {
        if (!(styleMap instanceof Map)) throw 'Data:Row:setStyleMap: styleMap param must be a Map()';
        this.#styleMap = styleMap;
    }
    setRow(row) {
        if (parseInt(row, 10) === NaN || parseInt(row, 10) !== row) throw 'Data:Row:setRow: row param must be valid num';
        this.#row = row;
    }
    clearStyleMap() {
        this.#styleMap.clear();
    }
}

class Cell {
    #styleMap;
    #cellRow;
    #cellCol;
    #val;
    constructor(styleMap, row, col, val) {
        if (!(styleMap instanceof Map)) throw 'Data:Cell:constructor: styleMap param must be a Map()';
        for (const [property, value] of styleMap.entries()) {
            if (property == 'height' || property == 'width' || property == 'marginLeft') {
                if (isNaN(parseInt(value, 10)) || parseInt(value, 10) !== value) throw 'Data:Cell:constructor:styleMap: value of height/width/marginLeft must be valid num';
            } else throw 'Data:Cell:constructor:styleMap: found invalid property' + property;
        }
        if (isNaN(parseInt(row, 10)) || parseInt(row, 10) !== row) throw 'Data:Cell:constructor: row param must be valid num';
        if (isNaN(parseInt(col, 10)) || parseInt(col, 10) !== col) throw 'Data:Cell:constructor: col param must be valid num';
        if (!isNaN(parseInt(val, 10)) && parseInt(val, 10) !== val) throw 'Data:Cell:constructor: val param must be null or valid num';
        this.#styleMap = styleMap;
        this.#cellRow = row;
        this.#cellCol = col;
        this.#val = val;
    }
    getStyleMap() {
        return this.#styleMap;
    }
    getCellRow() {
        return this.#cellRow;
    }
    getCellCol() {
        return this.#cellCol;
    }
    getVal() {
        return this.#val;
    }
    putStyle(property, value) {
        if (property === null || property === undefined || value === null || value === undefined) throw 'Data:Cell:putStyle: property or value is null/undefined';
        if (property == 'width' || property == 'height' || property == 'marginLeft') {
            if (isNaN(parseInt(value, 10)) || parseInt(value, 10) != value) throw 'Data:Cell:putStyle: value for height/width/marginLeft must be valid num';
        } else throw 'Data:Cell:putStyle: found invalid property' + property;
        this.#styleMap.set(property, value);
    }
    setStyleMap(styleMap) {
        if (!(styleMap instanceof Map)) throw 'Data:Cell:setStyleMap: styleMap param must be a Map()';
        this.#styleMap = styleMap;
    }
    setCellRow(row) {
        if (isNaN(parseInt(row, 10)) || parseInt(row, 10) !== row) throw 'Data:Cell:setCellRow: row param must be valid num';
        this.#cellRow = row;
    }
    setCellCol(col) {
        if (isNaN(parseInt(col, 10)) || parseInt(col, 10) !== col) throw 'Data:Cell:setCellCol: col param must be valid num';
        this.#cellCol = col;
    }
    setVal(val) {
        if (isNaN(parseInt(val, 10)) || parseInt(val, 10) !== val) throw 'Data:Cell:setVal: val param must be valid num';
        this.#val = val;
    }
    clearStyleMap() {
        this.#styleMap.clear();
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
    clear() {
        this.entries.clear();
    }
}

export default Data;