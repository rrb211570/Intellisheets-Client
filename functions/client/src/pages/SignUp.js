import React from 'react';
import { useNavigate } from 'react-router-dom';
import rootURL from '../serverURL.js';

class EntryPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            validUser: false,
            validPass: false,
            passwordsMatch: false,
        }
        this.signUpHandler = this.signUpHandler.bind(this);
        this.backToHome = this.backToHome.bind(this);
        this.userChanged = this.userChanged.bind(this);
        this.passChanged = this.passChanged.bind(this);
        this.pass2Changed = this.pass2Changed.bind(this);
    }
    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ margin: '2% 10% 2% 55%', width: '20%', height: '100%', border: '2px solid black' }}>
                    <div style={{ margin: '10%', display: 'flex', flexDirection: 'column' }}>
                        <p>Enter email</p>
                        <input id='userInput' type='text' style={{ margin: '10% 10% 0% 10%' }} onChange={this.userChanged}></input>
                        <p id='passTitle' style={{ visibility: 'hidden' }}>Select password</p>
                        <input id='passInput' type='password' style={{ margin: '10% 10% 0% 10%', visibility: 'hidden' }} onChange={this.passChanged}></input>
                        <p id='passContext' style={{ visibility: 'hidden' }}>Must contain at least 6 alphabetical characters and 2 non-alphabetical characters</p>
                        <input id='passInput2' type='password' placeholder='Retype Password' onChange={this.pass2Changed} style={{ margin: '10% 10% 0% 10%', visibility: 'hidden' }} disabled ></input>
                        <p id='pass2Context' style={{ visibility: 'hidden' }}>Passwords must match</p>
                        <p id='createContext' style={{ visibility: 'hidden' }}>* Username is taken *</p>
                        <button id='createAcct' style={{ margin: '10% 10% 0% 10%', visibility: 'hidden' }} disabled onClick={this.signUpHandler} >Create Account</button>
                        <button id='back' style={{ margin: '10% 10% 0% 10%' }} onClick={this.backToHome}>Back to Home</button>
                    </div>
                </div>
            </div>
        );
    }
    backToHome() {
        this.props.nav('/')
    }
    userChanged() {
        let username = document.querySelector('#userInput').value;
        if (username.length > 0 && /^\w+@\w+\.\w+$/.test(username)) {
            this.setState({
                validUser: true
            });
            document.querySelector('#createContext').style.visibility = 'hidden';
            document.querySelector('#passTitle').style.visibility = 'visible';
            document.querySelector('#passInput').style.visibility = 'visible';
            document.querySelector('#passContext').style.visibility = 'visible';
        } else {
            this.setState({
                validUser: false
            });
            if (username.length == 0 || /^\w+@\w+\.\w+$/.test(username) != true) {
                document.querySelector('#passTitle').style.visibility = 'hidden';
                document.querySelector('#passInput').style.visibility = 'hidden';
                document.querySelector('#passContext').style.visibility = 'hidden';
            }
            document.querySelector('#passInput2').style.visibility = 'hidden';
            document.querySelector('#createAcct').style.visibility = 'hidden';
            document.querySelector('#createAcct').disabled = 'true';
        }
    }
    passChanged() {
        let pass = document.querySelector('#passInput').value;
        let alphaCount = pass.match(/[A-Za-z]/g) != null ? pass.match(/[A-Za-z]/g).length : null;
        let nonAlphaCount = pass.match(/[^A-Za-z]/g) != null ? pass.match(/[^A-Za-z]/g).length : null;
        if (alphaCount != null && nonAlphaCount != null && alphaCount > 5 && nonAlphaCount > 1) {
            this.setState({
                validPass: true
            });
            document.querySelector('#passContext').style.visibility = 'hidden';
            document.querySelector('#passInput2').style.visibility = 'visible';
            document.querySelector('#passInput2').removeAttribute('disabled');
            document.querySelector('#createAcct').style.visibility = 'visible';
        } else {
            this.setState({
                validPass: false
            })
            document.querySelector('#passContext').style.visibility = 'visible';
            document.querySelector('#passInput2').style.visibility = 'hidden';
            document.querySelector('#passInput2').setAttribute('disabled', 'disabled');
            document.querySelector('#createAcct').style.visibility = 'hidden';
        }
    }
    pass2Changed() {
        let pass = document.querySelector('#passInput').value;
        let pass2 = document.querySelector('#passInput2').value;
        if (pass == pass2) {
            this.setState({
                passwordsMatch: true,
            });
            document.querySelector('#pass2Context').style.visibility = 'hidden';
            document.querySelector('#createAcct').removeAttribute('disabled');
            document.querySelector('#createAcct').onclick = this.signUpHandler;
        } else {
            this.setState({
                passwordsMatch: false
            });
            document.querySelector('#pass2Context').style.visibility = 'visible';
            document.querySelector('#createAcct').setAttribute('disabled', 'disabled');
        }
    }
    signUpHandler() {
        let user = document.querySelector('#userInput').value;
        let pass = document.querySelector('#passInput').value;
        console.log('login credentials: ' + user + ' ' + pass);
        document.querySelector('#createAcct').setAttribute('disabled', 'disabled');
        document.querySelector('#back').setAttribute('disabled', 'disabled');
        this.createUserIfAvailable(user, pass)
            .then(res => {
                console.log(res);
                if (res.status == 'success' & res.usernameAvailable) this.props.nav('/confirmCode/' + user);
                else {
                    document.querySelector('#createContext').style.visibility = 'visible';
                    document.querySelector('#createAcct').removeAttribute('disabled');
                    document.querySelector('#back').removeAttribute('disabled');
                }
            })
            .catch(err => {
                console.log('signUp API error: ' + err);
                document.querySelector('#createAcct').removeAttribute('disabled');
                document.querySelector('#back').removeAttribute('disabled');
            });
    }
    createUserIfAvailable = async (user, pass) => {
        const response = await fetch(rootURL + 'newuser/' + user + '/' + pass);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.error)
        }
        return body;
    };
}
function SignUp() {
    let nav = useNavigate();
    return <EntryPanel nav={nav}></EntryPanel>
}
export default SignUp;