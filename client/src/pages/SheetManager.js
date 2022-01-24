import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { store, mapStateToProps, mapDispatchToProps} from '../store.js';

class SheetPreview {
    #title;
    #id;
    constructor(title, id) {
        this.#title = title;
        this.#id = id;
    }
    getTitle() {
        return this.#title;
    }
    getID() {
        return this.#id;
    }
}

class ManagerPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sheetPreviews: []
        }
    }
    componentDidMount() {
        console.log('user: '+this.props.user+' pass: '+this.props.pass);
        this.callSheetLoaderAPI(this.props.user, this.props.pass)
            .then(res => console.log('user: '+res.username+' id: '+res._id+' res.sheets: '+res.sheets.length))
            .catch(err => console.log(err));
    }
    callSheetLoaderAPI = async (user, pass) => {
        const response = await fetch('https://safe-dawn-48616.herokuapp.com/sheets/' + user + '/' + pass);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }
    render() {
        return (
            <div>
                <div>SheetManager</div>
                <Link to='/'>Log out</Link>
                <Link to='/editor'>New sheet</Link>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {this.state.sheetPreviews.map(sheet => <button id={sheet.getID()} onClick={this.openSheet}>{sheet.getTitle()}</button>)}
                </div>
                <Outlet />
            </div>
        );
    }
    openSheet() {
        this.props.nav(`/editor`);
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

export default SheetManager;