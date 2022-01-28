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
        this.newSheet = this.newSheet.bind(this);
        this.openSheet = this.openSheet.bind(this);
    }
    render() {
        return (
            <div>
                <div>SheetManager</div>
                <Link to='/'>Log out</Link>
                <button button id='newSheet' onClick={this.newSheet}>New Sheet</button>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {this.state.sheetPreviews.map(sheetPreview => (<button id={sheetPreview.id} onClick={this.openSheet}>{sheetPreview.title}</button>))}
                </div>
                <Outlet />
            </div>
        );
    }
    componentDidMount() {
        console.log('user: ' + this.props.user + ' pass: ' + this.props.pass);
        this.callSheetLoaderAPI(this.props.user, this.props.pass)
            .then(res => {
                console.log('user: ' + res.username + ' id: ' + res._id + ' res.sheetPreviews: ' + res.sheetPreviews.length);
                console.log(res.sheetPreviews);
                this.setState({ sheetPreviews: res.sheetPreviews });
            })
            .catch(err => console.log(err));
    }
    newSheet() {
        this.callNewSheetAPI(this.props.user, this.props.pass)
            .then(res => {
                if (res.status == 'NEW_SHEET') this.props.nav(`/editor/` + res.newSheetID);
            })
            .catch(err => console.log(err));
        console.log('newSheet() somehow failed');
    }
    openSheet(e) {
        this.callOpenSheetAPI(this.props.user, this.props.pass, e.target.id)
            .then(res => {
                if (res.status == 'OPEN_SHEET') this.props.nav(`/editor/` + res.newSheetID);
            })
            .catch(err => console.log(err));
        console.log('openSheet() somehow failed');
    }
    callNewSheetAPI = async (user, pass) => {
        const response = await fetch(rootURL + 'createSheet/' + user + '/' + pass + '/' + DEFAULTROWS + '/' + DEFAULTCOLS);
        console.log('response');
        console.log(response);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    callOpenSheetAPI = async (user, pass, id) => {
        const response = await fetch(rootURL + 'loadSheet/' + user + '/' + pass + '/' + id);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    callSheetLoaderAPI = async (user, pass) => {
        const response = await fetch(rootURL + 'sheets/' + user + '/' + pass);
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