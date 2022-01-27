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
        this.signUpHandler = this.signUpHandler.bind(this)
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
                        <p>Choose username</p>
                        <input type='text' name='user' style={{ margin: '10% 10% 0% 10%' }} onChange={this.userChanged}></input>
                        <p id='userContext' style={{ visibility: 'hidden' }}>Username must only contain alphanumeric characters</p>
                        <p id='passTitle' style={{ visibility: 'hidden' }}>Select password</p>
                        <input type='password' name='pass' style={{ margin: '10% 10% 0% 10%', visibility: 'hidden' }} onChange={this.passChanged}></input>
                        <p id='passContext' style={{ visibility: 'hidden' }}>Must contain at least 6 alphabetical characters and 2 non-alphabetical characters</p>
                        <input type='password' name='pass2' placeholder='Retype Password' onChange={this.pass2Changed} style={{ margin: '10% 10% 0% 10%', visibility: 'hidden' }} disabled ></input>
                        <p id='pass2Context' style={{ visibility: 'hidden' }}>Passwords must match</p>
                        <p id='createContext' style={{ visibility: 'hidden' }}>* Username is taken *</p>
                        <button id='createAcct' style={{ margin: '10% 10% 0% 10%', visibility: 'hidden' }} disabled onClick={this.signUpHandler} >Create Account</button>
                        <button style={{ margin: '10% 10% 0% 10%' }} onClick={this.backToHome}>Back to Home</button>
                    </div>
                </div>
            </div>
        );
    }
    signUpHandler() {
        let user = document.querySelector('input[name="user"]').value;
        let pass = document.querySelector('input[name="pass"]').value;
        console.log('login credentials: ' + user + ' ' + pass);
        this.createUserIfAvailable(user, pass)
            .then(res => {
                if(res.usernameAvailable) this.props.nav(`/sheets?user=${user}&pass=${pass}`);
                else document.querySelector('#createContext').style.visibility = 'visible';
            })
            .catch(err => {
                console.log('signUp API error: ' + err);
            });
    }
    createUserIfAvailable = async (user, pass) => {
        const response = await fetch(rootURL+'newuser/'+user+'/'+pass);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.error)
        }
        return body;
    };
    backToHome() {
        this.props.nav('/')
    }
    userChanged() {
        let username = document.querySelector('input[name="user"]').value;
        if (username.length > 0 && /^\w+$/.test(username)) {
            this.setState({
                validUser: true
            });
            document.querySelector('#createContext').style.visibility = 'hidden';
            document.querySelector('#userContext').style.visibility = 'hidden';
            document.querySelector('#passTitle').style.visibility = 'visible';
            document.querySelector('input[name="pass"]').style.visibility = 'visible';
            document.querySelector('#passContext').style.visibility = 'visible';
        } else {
            this.setState({
                validUser: false
            });
            if (username.length == 0 || /\W/.test(username)) {
                document.querySelector('#passTitle').style.visibility = 'hidden';
                document.querySelector('input[name="pass"]').style.visibility = 'hidden';
                document.querySelector('#passContext').style.visibility = 'hidden';
            }
            if (/\W/.test(username)) document.querySelector('#userContext').style.visibility = 'visible';
            document.querySelector('input[name="pass2"]').style.visibility = 'hidden';
            document.querySelector('#createAcct').style.visibility = 'hidden';
            document.querySelector('#createAcct').disabled = 'true';
        }
    }
    passChanged() {
        let pass = document.querySelector('input[name="pass"]').value;
        let alphaCount = pass.match(/[A-Za-z]/g) != null ? pass.match(/[A-Za-z]/g).length : null;
        let nonAlphaCount = pass.match(/[^A-Za-z]/g) != null ? pass.match(/[^A-Za-z]/g).length : null;
        if (alphaCount != null && nonAlphaCount != null && alphaCount > 5 && nonAlphaCount > 1) {
            this.setState({
                validPass: true
            });
            document.querySelector('#passContext').style.visibility = 'hidden';
            document.querySelector('input[name="pass2"]').style.visibility = 'visible';
            document.querySelector('input[name="pass2"]').removeAttribute('disabled');
            document.querySelector('#createAcct').style.visibility = 'visible';
        } else {
            this.setState({
                validPass: false
            })
            document.querySelector('#passContext').style.visibility = 'visible';
            document.querySelector('input[name="pass2"]').style.visibility = 'hidden';
            document.querySelector('input[name="pass2"]').setAttribute('disabled', 'disabled');
            document.querySelector('#createAcct').style.visibility = 'hidden';
        }
    }
    pass2Changed() {
        let pass = document.querySelector('input[name="pass"]').value;
        let pass2 = document.querySelector('input[name="pass2"]').value;
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
}
function SignUp() {
    let nav = useNavigate();
    return <EntryPanel nav={nav}></EntryPanel>
}
export default SignUp;