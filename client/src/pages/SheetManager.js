import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

class SheetPreview{
    #title;
    #id;
    constructor(title, id){
        this.#title = title;
        this.#id = id;
    }
    getTitle(){
        return this.#title;
    }
    getID(){
        return this.#id;
    }
}

class Manager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            pass: '',
            sheetPreviews: []
        }
    }
    componentDidMount() {
        /*this.callSheetLoaderAPI()
            .then(res => console.log(res.username + ' ' + res._id + ' ' + res.sheets))
            .catch(err => console.log(err));*/
    }
    callSheetLoaderAPI = async () => {
        const response = await fetch('/api/users', {
            method: "POST",
            body: JSON.stringify({
                username: 'Rocky Balboa231'
            }),
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        });
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
                    {this.state.sheetPreviews.map(sheet=><button id={sheet.getID()} onClick={this.openSheet}>{sheet.getTitle()}</button>)}
                </div>
                <Outlet />
            </div>
        );
    }
    openSheet(){
        this.props.nav(`/editor?user=${this.state.user}&pass=${this.state.pass}`);
    }
}

function SheetManager(){
    let nav = useNavigate();
    return <Manager nav={nav}></Manager>
}

export default SheetManager;