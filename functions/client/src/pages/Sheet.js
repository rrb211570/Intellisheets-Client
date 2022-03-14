import React from 'react';
import { Provider, connect } from 'react-redux'
import '../index.css';
import { SpreadSheetPanel } from '../components'
import { store, mapStateToProps, mapDispatchToProps, updateSheetDimensions, clearHistoryState } from '../store.js'
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
                <div className='editorNavBar'>
                    <button id='back' className='navButton' onClick={this.NavtoSheetManager}>{'<- Back'}</button>
                    <p style={{
                        color: 'white', display: 'flex',
                        alignItems: 'center'
                    }}>Note: Auto-save triggers every ~3 seconds. Undo/redo: CTRL+Z and CTRL+Y (Meta for Mac users). Bug: undo/redo doesn't get properly saved at the moment.</p>
                    <button id='logout' className='navButton' onClick={this.logout}>Log out</button>
                </div>
                <div id="pageID" className="page">
                    <Provider store={store}>
                        <SpreadSheetContainer rows={DEFAULTROWS} cols={DEFAULTCOLS} rowHeight={DEFAULTROWHEIGHT} colWidth={DEFAULTCOLWIDTH} loadedSheet={this.state.loadedSheet} whichTests={[]} />
                    </Provider>
                </div>
            </div >
        );
    }
    componentDidMount() {
        let id = window.location.href.match(/.+editor\/(.+)/)[1];
        document.querySelector('#back').setAttribute('disabled', 'disabled');
        document.querySelector('#logout').setAttribute('disabled', 'disabled');
        this.loadSheetAPI(id)
            .then(res => {
                console.log(res);
                if (res.status == 'success') {
                    let timer = setInterval(() => {
                        console.log('autoSave()');
                        if ([...this.props.collectedData.getIndividualEntries()].length != 0 ||
                            [...this.props.collectedData.getGroupEntries()].length != 0) {
                            //console.log(this.props.collectedData);
                            //console.log(this.props.sentData);

                            this.saveAPI(this.state.sheetID)
                                .then(res => {
                                    if (res.status == 'success') {
                                        console.log('save result');
                                        console.log(res.dat);
                                        this.props.save();
                                        // console.log(this.props.sentData);
                                    }
                                    else console.log('autoSave failed');
                                })
                                .catch(err => {
                                    console.log('saveError: ' + err);
                                    clearInterval(timer);
                                });
                        }
                    }, 3000)
                    this.setState({
                        sheetID: id,
                        loadedSheet: res,
                        autoSaveTimer: timer,
                    })
                    document.querySelector('#back').removeAttribute('disabled');
                    document.querySelector('#logout').removeAttribute('disabled');
                } else {
                    if (res.status == 'fail') {
                        if (res.reason == 'missing token') this.props.nav('/');
                        if (res.reason == 'sheetID does not exist') this.props.nav('/sheets')
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
        document.querySelector('#back').setAttribute('disabled', 'disabled');
        document.querySelector('#logout').setAttribute('disabled', 'disabled');
        clearInterval(this.state.autoSaveTimer);
        store.dispatch(clearHistoryState());
        this.props.nav(`/sheets`);
    }
    logout() {
        document.querySelector('#back').setAttribute('disabled', 'disabled');
        document.querySelector('#logout').setAttribute('disabled', 'disabled');
        this.logoutAPI()
            .then(res => {
                if (res.status == 'success') {
                    clearInterval(this.state.autoSaveTimer);
                    store.dispatch(clearHistoryState());
                    this.props.nav('/');
                } else {
                    document.querySelector('#back').removeAttribute('disabled');
                    document.querySelector('#logout').removeAttribute('disabled');
                }
            })
            .catch(err => {
                console.log(err);
                document.querySelector('#back').removeAttribute('disabled');
                document.querySelector('#logout').removeAttribute('disabled');

            });
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
        console.log(exposedCollectedData);
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
        let individualArr = [];
        for (const [entryKey, value] of data.getIndividualEntries()) {
            let individual = { entryKey: entryKey };
            individual.styleMap = [...[...value.getStyleMap().entries()].map(styleEntry => {
                return [styleEntry[0], styleEntry[1]];
            })];
            if (entryKey != 'spreadsheet' && !/.col\d+/.test(entryKey)) individual.row = value.getRow();
            else if (/.col\d+/.test(entryKey)) {
                individual.row = value.getCellRow();
                individual.col = value.getCellCol();
                individual.val = value.getVal();
            }
            individualArr.push(individual);
        }
        let groupArr = [];
        for (const [groupName, styleMap] of data.getGroupEntries()) {
            let group = { groupName: groupName };
            group.styleMap = [...[...styleMap.entries()].map(styleEntry => {
                return [styleEntry[0], styleEntry[1]];
            })];
            groupArr.push(group);
        }
        return { individualData: individualArr, groupData: groupArr };
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