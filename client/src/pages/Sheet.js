import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux'
import '../index.css';
import { SpreadSheetPanel } from '../components'
import { rootReducer, mapStateToProps, mapDispatchToProps, updateSheetDimensions } from '../store.js'
import { useNavigate } from 'react-router-dom';
// test flags
const ALL = -1;
const RESIZING = 0;
const TEXTCHANGE = 1;

// table arguments & store initialization
const ROWS = 100;
const COLS = 26;
const DEFAULTROWHEIGHT = '20';
const DEFAULTCOLWIDTH = '100';

const store = createStore(rootReducer);
const SpreadSheetContainer = connect(mapStateToProps, mapDispatchToProps)(SpreadSheetPanel);
store.dispatch(updateSheetDimensions((parseInt(ROWS, 10) + 1) * DEFAULTROWHEIGHT, (COLS * DEFAULTCOLWIDTH) + (DEFAULTCOLWIDTH / 2)));

let autoSaveToggle = true;
class SheetPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            autoSaveToggle: this.props.autoSaveToggle
        }
        this.NavtoSheetManager = this.NavtoSheetManager.bind(this);
    }
    render() {
        return (
            <div>
                <div className="header" style={{ height: window.innerHeight * .05 }}>
                    Lifestyle Trackers
                </div>
                <button onClick={this.NavtoSheetManager}>{'<- Back'}</button>
                <div id="pageID" className="page">
                    <Provider store={store}>
                        <SpreadSheetContainer rows={ROWS} cols={COLS} defaultRowHeight={DEFAULTROWHEIGHT} defaultColWidth={DEFAULTCOLWIDTH} whichTests={[]} visibleSheet={this.state.autoSaveToggle} />
                    </Provider>
                </div>
            </div>
        );
    }
    NavtoSheetManager() {
        this.state.autoSaveToggle = false;
        this.props.nav(`/sheets`);
    }
}
function Sheet() {
    let nav = useNavigate();
    return <SheetPage nav={nav} autoSaveToggle={autoSaveToggle}></SheetPage>
}
export default Sheet;