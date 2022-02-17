import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Provider, connect} from 'react-redux';
import { store, mapStateToProps, mapDispatchToProps } from '../store.js'
import rootURL from '../serverURL.js';

class ConfirmCodePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.confirmCodeHandler = this.confirmCodeHandler.bind(this);
    }
    render() {
        return (
            <div>
                <p>Enter confirmation code sent to your email to complete registration.</p>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <input id='codeInput' type='text'></input>
                    <button onClick={this.confirmCodeHandler}>Confirm</button>
                    <p id='confirmContext' style={{visibility: 'hidden'}}>*Please enter valid code sent to your email*</p>
                </div>
            </div>
        );
    }
    confirmCodeHandler() {
        let user = window.location.href.match(/.+confirmCode\/(.+)/)[1];
        let code = document.querySelector('#codeInput').value;
        console.log(user + ' ' + code);
        this.confirmCodeAPI(user, code)
            .then(res => {
                console.log(res);
                if (res.status == 'success') this.props.nav(`/sheets`);
                else if(res.status=='fail'){
                    if(res.reason!='invalid code') document.querySelector('#confirmContext').value='Server error. Try again later.';
                    else document.querySelector('#confirmContext').value='*Please enter valid code sent to your email*';
                    document.querySelector('#confirmContext').style.visibility = 'visible';
                }
            })
            .catch(err => {
                console.log('confirmCodeAPI error: ' + err);
            });
    }
    confirmCodeAPI = async (user, code) => {
        const response = await fetch(rootURL + 'confirmCode/' + user + '/' + code);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.error)
        }
        return body;
    }
}

const ConfirmCodeContainer = connect(mapStateToProps, mapDispatchToProps)(ConfirmCodePanel);
function ConfirmCode() {
    let nav = useNavigate();
    return (
        <Provider store={store}>
            <ConfirmCodeContainer nav={nav}></ConfirmCodeContainer>
        </Provider>
    );
}
export default ConfirmCode;