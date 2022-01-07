function getRowNum(rowClass){
    return rowClass != null ? rowClass.replace(/\D*/, '') : null;
}

function getColNum(colClass){
    return colClass != null ? colClass.replace(/\D*/, '') : null;
}

function getEntryKey(rowClass, colClass){
    return rowClass == null ? 'spreadsheet' : colClass == null ? rowClass : 'cell' + rowClass+ colClass;
}

export {getRowNum, getColNum, getEntryKey};