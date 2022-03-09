import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { store, mapStateToProps, mapDispatchToProps } from '../store.js';
import rootURL from '../serverURL.js';

const DEFAULTROWS = 8;
const DEFAULTCOLS = 7;
const DEFAULTROWHEIGHT = '20';
const DEFAULTCOLWIDTH = '100';

class ManagerPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sheetPreviews: [],
            selectedSheetID: ''
        }
        this.logout = this.logout.bind(this);
        this.newSheet = this.newSheet.bind(this);
        this.openSheet = this.openSheet.bind(this);
    }
    render() {
        return (
            <div>
                <div style={{ backgroundColor: '#F5F5F5', position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px', zIndex: '-1' }}>
                </div>
                <div className='managerNavBar'>
                    <button className='navButton' id='logout' onClick={this.logout}>Log out</button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={this.newSheet} style={{ minWidth: '400px', width: '50%', marginBottom: '20px' }}>New Sheet</button>
                    <div style={{ minWidth: '400px', width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid gray', padding: '0px 40px' }}>
                        <p style={{ textAlign: 'center', margin: '10px', color: 'gray' }}>Name</p>
                        <p style={{ margin: '10px', color: 'gray' }}>Date Modified</p>
                    </div>
                    {this.state.sheetPreviews.map(sheetPreview => (
                        <div className='sheetPreview' id={sheetPreview.id} onClick={this.openSheet} onMouseEnter={this.previewMouseEnter} onMouseLeave={this.previewMouseLeave} onMouseDown={this.previewMouseDown} onMouseUp={this.previewMouseUp} style={{ minWidth: '400px', width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid gray', padding: '0px 40px', backgroundColor: '#F5F5F5' }}>
                            <p style={{ margin: '10px' }}>{sheetPreview.title}</p>
                            <p style={{ margin: '10px' }}>{sheetPreview.dateModified}</p>
                        </div>))}
                </div>
            </div>
        );
    }
    componentDidMount() {
        console.log('loading sheets');
        this.loadSheetsAPI()
            .then(res => {
                console.log(res);
                if (res.status == 'fail') this.props.nav('/');
                else this.setState({ sheetPreviews: res.sheetPreviews });
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
                console.log(res);
                if (res.status == 'success') this.props.nav('/');
            })
            .catch(err => console.log(err));
    }
    logoutAPI = async () => {
        const response = await fetch(rootURL + 'logout', { credentials: 'include' });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    newSheet() {
        this.newSheetAPI()
            .then(res => {
                console.log(res);
                if (res.status == 'success') this.props.nav('/editor/' + res.newSheetID);
            })
            .catch(err => console.log(err));
        console.log('newSheet() somehow failed');
    }
    newSheetAPI = async () => {
        const response = await fetch(rootURL + 'createSheet/' + DEFAULTROWS + '/' + DEFAULTCOLS, { credentials: 'include' });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    openSheet(e) {
        let previewSheetDiv;
        if (e.target.nodeName == 'DIV') previewSheetDiv = e.target;
        else previewSheetDiv = e.target.parentNode;
        console.log('id: ' + previewSheetDiv.id);
        this.props.nav('/editor/' + previewSheetDiv.id);
    }
    previewMouseEnter(e) {
        let previewSheetDiv;
        if (e.target.nodeName == 'DIV') previewSheetDiv = e.target;
        else previewSheetDiv = e.target.parentNode;
        previewSheetDiv.style.backgroundColor = '#C9C9C9';
    }
    previewMouseLeave(e) {
        let previewSheetDiv;
        if (e.target.nodeName == 'DIV') previewSheetDiv = e.target;
        else previewSheetDiv = e.target.parentNode;
        previewSheetDiv.style.backgroundColor = '#F5F5F5';
    }
    previewMouseDown(e) {
        let previewSheetDiv;
        if (e.target.nodeName == 'DIV') previewSheetDiv = e.target;
        else previewSheetDiv = e.target.parentNode;
        previewSheetDiv.style.backgroundColor = '#A6A6A6';
        previewSheetDiv.style.border = '2px solid black';
    }
    previewMouseUp(e) {
        let previewSheetDiv;
        if (e.target.nodeName == 'DIV') previewSheetDiv = e.target;
        else previewSheetDiv = e.target.parentNode;
        previewSheetDiv.style.backgroundColor = '#F5F5F5';
        previewSheetDiv.style.border = 'none';
        previewSheetDiv.style.borderBottom = '1px solid gra';
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