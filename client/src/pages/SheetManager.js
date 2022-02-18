import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { store, mapStateToProps, mapDispatchToProps } from '../store.js';
import rootURL from '../serverURL.js';

const DEFAULTROWS = 100;
const DEFAULTCOLS = 26;
const DEFAULTROWHEIGHT = '20';
const DEFAULTCOLWIDTH = '100';

class ManagerPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sheetPreviews: []
        }
        this.logout = this.logout.bind(this);
        this.newSheet = this.newSheet.bind(this);
        this.openSheet = this.openSheet.bind(this);
    }
    render() {
        return (
            <div>
                <div>SheetManager</div>
                <button id='logout' onClick={this.logout}>Log out</button>
                <button id='newSheet' onClick={this.newSheet}>New Sheet</button>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {this.state.sheetPreviews.map(sheetPreview => (<button id={sheetPreview.id} onClick={this.openSheet}>{sheetPreview.title}</button>))}
                </div>
                <Outlet />
            </div>
        );
    }
    componentDidMount() {
        console.log('loading sheets');
        this.loadSheetsAPI()
            .then(res => {
                console.log(res);
                if (res.status == 'fail') this.props.nav('/');
                else {
                    console.log(res);
                    this.setState({ sheetPreviews: '' });
                }
            })
            .catch(err => console.log('blah' + err));
    }
    loadSheetsAPI = async () => {
        const response = await fetch(rootURL + 'sheets', { credentials: 'include' });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    logout() {
        this.logoutAPI()
            .then(res => {
                if (res.status == 'success') this.props.nav('/');
            })
            .catch(err => console.log(err));
    }
    logoutAPI = async () => {
        const response = await fetch(rootURL + 'logout');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    newSheet() {
        this.newSheetAPI(this.props.user, this.props.pass)
            .then(res => {
                if (res.status == 'NEW_SHEET') this.props.nav(`/editor/` + res.newSheetID);
            })
            .catch(err => console.log(err));
        console.log('newSheet() somehow failed');
    }
    newSheetAPI = async (user, pass) => {
        const response = await fetch(rootURL + 'createSheet/' + user + '/' + pass + '/' + DEFAULTROWS + '/' + DEFAULTCOLS, { credentials: 'include' });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    openSheet(e) {
        console.log('id: ' + e.target.id);
        this.openSheetAPI(this.props.user, this.props.pass, e.target.id)
            .then(res => {
                if (res.status == 'OPEN_SHEET') this.props.nav(`/editor/` + e.target.id);
            })
            .catch(err => console.log(err));
        console.log('openSheet() somehow failed');
    }
    openSheetAPI = async (user, pass, id) => {
        const response = await fetch(rootURL + 'loadSheet/' + user + '/' + pass + '/' + id, { credentials: 'include' });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
}

const ManagerContainer = connect(mapStateToProps, mapDispatchToProps)(ManagerPanel);
function SheetManager() {
    let nav = useNavigate();
    return (
        <Provider store={store}>
            <ManagerContainer nav={nav}></ManagerContainer>
        </Provider>
    );
}

export { SheetManager, DEFAULTROWS, DEFAULTCOLS, DEFAULTROWHEIGHT, DEFAULTCOLWIDTH };