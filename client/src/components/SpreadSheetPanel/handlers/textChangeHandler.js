import Data from "../helpers/data";

function applyTextChangeHandlers(recordEntries) {
    let entryCells = [...document.querySelectorAll('.entryCell')];
    entryCells.forEach(entryCell => {
        applyTextChangeHandler(entryCell, recordEntries);
    });
}

function applyTextChangeHandler(entryCell, recordEntries) {
    let changeOccurred = false;
    const input = entryCell.querySelector('input');
    const col = [...entryCell.classList].filter(name => /^col.$/.test(name))[0];
    const row = [...entryCell.classList].filter(name => /^row.$/.test(name))[0];
    let prevData = new Data();
    let newData = new Data();
    let uselessStyleMap = new Map();

    const onFocusHandler = function (e) {
        prevData.setEntry('.' + row+'.' + col, uselessStyleMap, row, col, input.value);
        input.addEventListener('change', onChangeHandler);
        input.addEventListener('blur', onBlurHandler);
    }

    const onChangeHandler = function (e) {
        changeOccurred = true;
    }

    const onBlurHandler = function (e) {
        if (changeOccurred) {
            newData.setEntry('.' + row+'.' + col, uselessStyleMap, row, col, input.value);
            console.log('changed input');
            recordEntries(prevData,newData);
        }
        changeOccurred = false;
        input.removeEventListener('change', onChangeHandler);
        input.removeEventListener('blur', onBlurHandler);
    }

    input.addEventListener('focus', onFocusHandler);
}

export default applyTextChangeHandlers;