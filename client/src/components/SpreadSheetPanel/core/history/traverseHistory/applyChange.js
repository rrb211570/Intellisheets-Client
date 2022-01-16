// Need to separate this from applyState(), since setSheedDimensions -> setState()
// does not re-render properly on sequential calls
function updateSheetDimensions(styleMap, setSheetDimensions) {
    let h = null;
    let w = null;
    for (const [property, value] of styleMap.entries()) {
        if (typeof setSheetDimensions !== "undefined") {
            if (property == 'height') h = value;
            else if (property == 'width') w = value;
        }
    }
    document.getElementById('spreadsheet').querySelectorAll('.resizer-horizontal').forEach(resizer => {
        if (h != null) resizer.style.height = h + 'px';
    });
    document.getElementById('spreadsheet').querySelectorAll('.resizer-vertical').forEach(resizer => {
        if (w != null) resizer.style.width = w + 'px';
    });
    setSheetDimensions(h, w);
}

function applyChange(entry, styleMap, val) {
    if (val != null) entry.querySelector('input').value = val;
    for (const [property, value] of styleMap.entries()) {
        switch (property) {
            case 'height':
                entry.style.height = value + 'px';
                if ([...entry.classList].filter(name => /^col0$/.test(name)).length != 0) {
                    entry.style.lineHeight = value + 'px';
                }
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col.$/.test(name)).length != 0) {
                    entry.querySelector('input').style.height = value - 4 + 'px';
                    entry.querySelector('#cover').style.height = value + 'px';
                }
                break;
            case 'width':
                entry.style.width = value + 'px';
                if ([...entry.classList].filter(name => /^row0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col0$/.test(name)).length == 0 &&
                    [...entry.classList].filter(name => /^col.$/.test(name)).length != 0) {
                    entry.querySelector('input').style.width = value - 4 + 'px';
                    entry.querySelector('#cover').style.width = value + 'px';
                }
                break;
            case 'marginLeft':
                entry.style.marginLeft = value + 'px';
                break;
        }
    }
}

export { updateSheetDimensions, applyChange };