function applyTextChangeHandlers(recordEntries) {
    let entryCells = getEntryCells();
    entryCells.forEach(entryCell => {
        applyTextChangeHandler(entryCell, recordEntries);
    });
}
function getEntryCells() {
    const table = document.getElementById('spreadsheet');
    return [...table.querySelectorAll('.entryCell')];
}

function applyTextChangeHandler(entryCell, recordEntries) {
    let changeOccurred = false;
    const input = entryCell.querySelector('input');
    const col = '.' + [...entryCell.classList].filter(name => /^col.$/.test(name))[0];
    const row = '.' + [...entryCell.classList].filter(name => /^row.$/.test(name))[0];
    let inputRecord = [];

    const onFocusHandler = function (e) {
        console.log('focus input');
        inputRecord = [row, col, [input.value, []]];
        input.addEventListener('change', onChangeHandler);
        input.addEventListener('blur', onBlurHandler);
    }

    const onChangeHandler = function (e) {
        console.log('change input');
        changeOccurred = true;
    }

    const onBlurHandler = function (e) {
        if (changeOccurred) {
            inputRecord.push([input.value, []]);
            console.log('blur input');
            recordEntries([inputRecord]);
        }
        changeOccurred = false;
        inputRecord = [];
        input.removeEventListener('change', onChangeHandler);
        input.removeEventListener('blur', onBlurHandler);
    }

    input.addEventListener('focus', onFocusHandler);
}

export default applyTextChangeHandlers;