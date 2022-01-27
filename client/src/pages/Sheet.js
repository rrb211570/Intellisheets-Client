import React from 'react';
import { Provider, connect } from 'react-redux'
import '../index.css';
import { SpreadSheetPanel } from '../components'
import { store, mapStateToProps, mapDispatchToProps, updateSheetDimensions } from '../store.js'
import { useNavigate } from 'react-router-dom';
import {DEFAULTROWS, DEFAULTCOLS, DEFAULTROWHEIGHT, DEFAULTCOLWIDTH} from './SheetManager.js'
// test flags
const ALL = -1;
const RESIZING = 0;
const TEXTCHANGE = 1;

// table arguments & store initialization

const SpreadSheetContainer = connect(mapStateToProps, mapDispatchToProps)(SpreadSheetPanel);
store.dispatch(updateSheetDimensions((parseInt(DEFAULTROWS, 10) + 1) * DEFAULTROWHEIGHT, (DEFAULTCOLS * DEFAULTCOLWIDTH) + (DEFAULTCOLWIDTH / 2)));

let autoSaveToggle = true;
class SheetPage extends React.Component {
    constructor(props) {
        super(props);
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
                        <SpreadSheetContainer rows={DEFAULTROWS} cols={DEFAULTCOLS} rowHeight={DEFAULTROWHEIGHT} colWidth={DEFAULTCOLWIDTH} whichTests={[]} visibleSheet />
                    </Provider>
                </div>
            </div>
        );
    }
    NavtoSheetManager() {
        this.props.nav(`/sheets`);
    }
}
function Sheet() {
    let nav = useNavigate();
    return <SheetPage nav={nav} autoSaveToggle={autoSaveToggle}></SheetPage>
}
export default Sheet;