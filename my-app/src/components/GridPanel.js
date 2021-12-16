import React from 'react';

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let DEFAULT_ROWS = 26;

class GridPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableBoundaryHit: false
        }
    }
    componentDidMount() {
        applyResizers();
    }
    render() {
        return (
            <div class="content" id="contentID">
                <table id="my-table" style={{ height: window.innerHeight * .95 }} dangerouslySetInnerHTML={{ __html: initialize() }}>
                </table>
            </div>
        );
    }
}
export default GridPanel;

function initialize(storedLayout = null) {
    if (storedLayout != null) return storedLayout;
    let str = addTopAxis('');
    for (let i = 1; i < DEFAULT_ROWS; ++i) str = addDefaultRow(str, i);
    return str;
}

function addTopAxis(str) {
    str = str + '<thead><tr id="row0" style="height: ' + window.innerHeight * .95 / DEFAULT_ROWS + '" >';
    str = str + '<th id="col0" style="height: ' + window.innerHeight * .95 / DEFAULT_ROWS + '"><div class="y-axis-head" id="row0div">&nbsp;</div></th>';
    for (let j = 1; j < 26; ++j) {
        let letter = alphabet[Math.floor((j - 1) / 26) === 0 ? j - 1 : (j - 1) % 26];
        str = str + '<th id="col' + j + '" style="height: ' + window.innerHeight * .95 / DEFAULT_ROWS + '">' + letter + '</th>';
    }
    str = str + '</tr></thead>'
    return str;
}

function addDefaultRow(str, index) {
    str = str + '<tr id="row' + index + '" style="height:' + window.innerHeight * .95 / DEFAULT_ROWS + '">';
    str = str + '<td id="col0" style="height:' + window.innerHeight * .95 / DEFAULT_ROWS + '"><div class="y-axis-head" id="row'+index+'div">' + index + '</div></td>';
    for (let j = 1; j < DEFAULT_ROWS; ++j) {
        str = str + '<td id="col' + j + '" style="height: ' + window.innerHeight * .95 / DEFAULT_ROWS + '"></td>';
    }
    str = str + '</tr>'
    return str;
}

function applyResizers() {
    fixResizers('col');
    fixResizers('row');
}

function fixResizers(axis) {
    let table = document.getElementById('my-table');
    let axisEntries = [];;
    if (axis === 'col') axisEntries = [...table.querySelectorAll('th')];
    else {
        for(let i=0;i<DEFAULT_ROWS;++i) axisEntries.push(document.getElementById(`row${i}div`));
    }
    axisEntries.map((entry) => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer-' + (axis === 'col' ? 'top' : 'left'));
        if (axis === 'col') resizer.style.height = `${table.offsetHeight}px`;
        else resizer.style.width = `${table.offsetWidth}px`;
        entry.appendChild(resizer);
        createResizableColumn(entry, resizer, axis);
    });
}

function createResizableColumn(entry, resizer, axis) {
    let x = 0;
    let y = 0;
    let h = 0;
    let w = 0;

    const mouseDownHandler = function (e) {
        if (axis === 'col') {
            x = e.clientX;
            w = parseInt(window.getComputedStyle(entry).width, 10);
        } else {
            y = e.clientY;
            h = parseInt(window.getComputedStyle(entry).height, 10);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        resizer.classList.add('resizing-' + (axis === 'col' ? 'top' : 'left'));
    };

    // disable resizing if table.width == content.width
    const mouseMoveHandler = function (e) {
        if(axis==='col'){
            const dx = e.clientX - x;
            let tableWidth = document.getElementById('my-table').offsetWidth;
            let pageWidth = document.getElementById('contentID').offsetWidth;
            if(tableWidth===pageWidth){

            } else if(tableWidth+dx>pageWidth){
            } else {
                entry.style.width = w + dx + 'px';
            }
        } else {
            const dy = e.clientY - y;
            let tableHeight = document.getElementById('my-table').offsetHeight;
            let contentHeight = document.getElementById('contentID').offsetHeight;
            if(tableHeight+dy>contentHeight){

            } else entry.style.height = h + dy + 'px';
        }
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        resizer.classList.remove('resizing-' + (axis === 'col' ? 'top' : 'left'));
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}