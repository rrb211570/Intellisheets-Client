import Data from '../core/history/data.js';

function applyTextChangeHandlers(recordChange) {
    let entryCells = [...document.querySelectorAll('.entryCell')];
    entryCells.forEach(entryCell => {
        applyTextChangeHandler(entryCell, recordChange);
    });
}

function applyTextChangeHandler(entryCell, recordChange) {
    let changeOccurred = false;
    const input = entryCell.querySelector('input');
    const row = [...entryCell.classList].filter(name => /^row\d+$/.test(name))[0];
    const col = [...entryCell.classList].filter(name => /^col\d+$/.test(name))[0];
    let rowNum = parseInt(row.match(/(\d+)/)[0],10);
    let colNum = parseInt(col.match(/(\d+)/)[0],10);
    let prevData = new Data();
    let newData = new Data();
    let uselessStyleMap = new Map();

    const onFocusHandler = function (e) {
        prevData.setIndividualEntry('.' + row + '.' + col, uselessStyleMap, rowNum, colNum, input.value);
        input.addEventListener('change', onChangeHandler);
        input.addEventListener('blur', onBlurHandler);
    }

    const onChangeHandler = function (e) {
        changeOccurred = true;
    }

    const onBlurHandler = function (e) {
        if (changeOccurred) {
            newData.setIndividualEntry('.' + row + '.' + col, uselessStyleMap, rowNum, colNum, input.value);
            console.log('changed input');
            recordChange(prevData, newData);
        }
        changeOccurred = false;
        input.removeEventListener('change', onChangeHandler);
        input.removeEventListener('blur', onBlurHandler);
    }

    input.addEventListener('focus', onFocusHandler);
}

export default applyTextChangeHandlers;