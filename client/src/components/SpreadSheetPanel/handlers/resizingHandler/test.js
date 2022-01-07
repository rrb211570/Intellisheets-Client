
function resizersTests() {
    console.log('\n--------RESIZING TESTs-----------------------');
    checkHorizontalResizersInitialization();
    checkVerticalResizersInitialization();
    let handling = { stage: 1 };
    checkResizing('.AxisX', handling, 10, 1);
    checkResizing('.AxisY', handling, 10, 2);
    checkResizing('.AxisX', handling, -20, 3);
    checkResizing('.AxisY', handling, -12, 4);
}
function checkHorizontalResizersInitialization() {
    let elems = document.querySelectorAll('.AxisX');
    let sheet = document.querySelector('#spreadsheet');
    let logMsg = '';
    elems.forEach((elem, idx) => {
        let resizer = elem.querySelector('.resizer-horizontal')
        if (resizer == null) {
            logMsg = logMsg + 'col' + (idx + 1) + ': horizontal resizer not found\n';
        } else if (parseInt(sheet.style.height, 10) != (parseInt(resizer.style.height, 10))) {
            logMsg = logMsg + 'col' + (idx + 1) + ': horizontal resizer does not match sheet height' + sheet.style.height + ' ' + resizer.style.height + '\n';
        }
    })
    if (logMsg.length != 0) console.log(logMsg);
    else console.log('horizontalResizers appended correctly');
}
function checkVerticalResizersInitialization() {
    let elems = document.querySelectorAll('.AxisY');
    let sheet = document.getElementById('spreadsheet');
    let logMsg = '';
    elems.forEach((elem, idx) => {
        let resizer = elem.querySelector('.resizer-vertical')
        if (resizer == null) {
            logMsg = logMsg + 'row' + idx + ': vertical resizer not found\n';
        } else if (parseInt(sheet.style.width, 10) != (parseInt(resizer.style.width, 10))) {
            logMsg = logMsg + 'row' + idx + ': vertical resizer does not match sheet width' + sheet.style.width + ' ' + resizer.style.width + '\n';
        }
    })
    if (logMsg.length != 0) console.log(logMsg);
    else console.log('verticalResizers appended correctly');
}
function checkResizing(axis, handling, delta, order) {
    try {
        let timer;
        let axisCells = document.querySelectorAll(axis);
        let resizer;
        let init = 0;
        let index = -1;
        let mouseState = -1;
        timer = setInterval(() => {
            switch (mouseState) {
                case -1: //wait here until handling.stage == your turn
                    if (handling.stage == order) mouseState = 5;
                    break;
                case 0:
                    resizer.dispatchEvent( new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 0 }));
                    mouseState++;
                    break;
                case 1:
                case 2:
                case 3:
                    let params = { bubbles: true, cancelable: true };
                    params[axis == '.AxisX' ? 'clientX' : 'clientY'] = init += delta;
                    resizer.dispatchEvent( new MouseEvent('mousemove', params));
                    mouseState++;
                    break;
                case 4:
                    resizer.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                    mouseState++;
                    break;
                case 5:
                    if (++index < axisCells.length) {
                        mouseState = 0;
                        init = 0;
                        resizer = axisCells[index].querySelector(axis == '.AxisX' ? '.resizer-horizontal' : '.resizer-vertical');
                    } else {
                        if (handling.stage == 1) {
                            handling.stage = 2;
                        } else if (handling.stage == 2) {
                            handling.stage = 3;
                        } else if (handling.stage == 3) {
                            handling.stage = 4;
                        }
                        clearInterval(timer);
                    }
                    break;
                default: break;
            }
        }, 5);
    } catch (error) {
        console.log(axis + ' resizingErr: ' + error);
    }
}

export default resizersTests;