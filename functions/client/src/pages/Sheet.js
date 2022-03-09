import React from 'react';
import { Provider, connect } from 'react-redux'
import '../index.css';
import { SpreadSheetPanel } from '../components'
import { store, mapStateToProps, mapDispatchToProps, updateSheetDimensions } from '../store.js'
import { useNavigate } from 'react-router-dom';
import { DEFAULTROWS, DEFAULTCOLS, DEFAULTROWHEIGHT, DEFAULTCOLWIDTH } from './SheetManager.js'
import rootURL from '../serverURL.js';

// test flags
const ALL = -1;
const RESIZING = 0;
const TEXTCHANGE = 1;

const SpreadSheetContainer = connect(mapStateToProps, mapDispatchToProps)(SpreadSheetPanel);
store.dispatch(updateSheetDimensions((parseInt(DEFAULTROWS, 10) + 1) * DEFAULTROWHEIGHT, (DEFAULTCOLS * DEFAULTCOLWIDTH) + (DEFAULTCOLWIDTH / 2)));

class SheetPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetID: '',
            loadedSheet: null,
            autoSaveTimer: null
        }
        this.NavtoSheetManager = this.NavtoSheetManager.bind(this);
        this.logout = this.logout.bind(this);
    }
    render() {
        return (
            <div>
                <div className="header" style={{ height: window.innerHeight * .05 }}>
                    Lifestyle Trackers
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <button onClick={this.NavtoSheetManager}>{'<- Back'}</button>
                    <button id='logout' onClick={this.logout}>Log out</button>
                </div>
                <div id="pageID" className="page">
                    <Provider store={store}>
                        <SpreadSheetContainer rows={DEFAULTROWS} cols={DEFAULTCOLS} rowHeight={DEFAULTROWHEIGHT} colWidth={DEFAULTCOLWIDTH} loadedSheet={this.state.loadedSheet} whichTests={[]} />
                    </Provider>
                </div>
            </div>
        );
    }
    componentDidMount() {
        let id = window.location.href.match(/.+editor\/(.+)/)[1];
        this.loadSheetAPI(id)
            .then(res => {
                console.log(res);
                if (res.status == 'success') {
                    this.setState({
                        sheetID: id, 
                        loadedSheet: res,
                        autoSaveTimer: setInterval(() => {/*
                            console.log('autoSave()');
                            if ([...this.props.collectedData.getEntries()].length != 0) {
                                console.log(this.props.collectedData);
                                console.log(this.props.sentData);
                                this.saveAPI(this.state.sheetID)
                                    .then(res => {
                                        if (res.status == 'success') {
                                            console.log(res.dat);
                                            this.props.save();
                                            console.log(this.props.sentData);
                                        }
                                        else console.log('autoSave failed');
                                    })
                                    .catch(err => {
                                        console.log('saveError: ' + err);
                                    });
                            }*/
                        }, 5000)
                    })
                } else {
                    if(res.status=='fail'){
                        if(res.reason=='missing token') this.props.nav('/');
                        if(res.reason=='sheetID does not exist') this.props.nav('/sheets')
                    }

                }
            })
            .catch(err => {
                console.log('load fail: ' + err);
                clearInterval(this.state.autoSaveTimer);
                this.props.nav('/')
            });
    }
    NavtoSheetManager() {
        clearInterval(this.state.autoSaveTimer);
        this.props.nav(`/sheets`);
    }
    logout() {
        this.logoutAPI()
            .then(res => {
                if (res.status == 'success') {
                    clearInterval(this.state.autoSaveTimer);
                    this.props.nav('/');
                }
            })
            .catch(err => console.log(err));
    }
    logoutAPI = async () => {
        const response = await fetch(rootURL + 'logout/', { credentials: 'include' });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    loadSheetAPI = async (id) => {
        const response = await fetch(rootURL + 'loadSheet/' + id, { credentials: 'include' });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    saveAPI = async (id) => {
        let exposedCollectedData = this.exposeCollectedData(this.props.collectedData);
        const response = await fetch(rootURL + 'saveSheet/' + id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                exposedCollectedData: exposedCollectedData
            }),
            credentials: 'include'
        });
        const body = response.json();
        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };
    exposeCollectedData(data) {
        let myArr = [];
        for (const [entryKey, value] of data.getEntries()) {
            let entryObj = { entryKey: entryKey };
            if (entryKey != 'spreadsheet' && !/.col./.test(entryKey)) entryObj.row = value.getRow();
            else if (/.col./.test(entryKey)) {
                entryObj.row = value.getCellRow();
                entryObj.col = value.getCellCol();
                entryObj.val = value.getVal();
            }
            entryObj.styleMap = [...[...value.getStyleMap().entries()].map(styleEntry => {
                return { property: styleEntry[0], value: styleEntry[1] }
            })];
            myArr.push(entryObj);
        }
        return myArr;
    }
}
const SheetContainer = connect(mapStateToProps, mapDispatchToProps)(SheetPanel);
function Sheet() {
    let nav = useNavigate();
    return (
        <Provider store={store}>
            <SheetContainer nav={nav} ></SheetContainer>
        </Provider>
    )
}
export default Sheet;