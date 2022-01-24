import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Provider, connect, useSelector } from 'react-redux';
import { store, mapStateToProps, mapDispatchToProps, login} from '../store.js'

class UserAuthPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.signUpHandler = this.signUpHandler.bind(this);
        this.logInHandler = this.logInHandler.bind(this);
    }
    logInHandler() {
        let user = document.getElementsByName('user')[0].value;
        let pass = document.getElementsByName('pass')[0].value;

        this.tryLogIn(user, pass)
            .then(res => {
                if (res.validCredentials) {
                    store.dispatch(login(user, pass));
                    this.props.nav(`/sheets`);
                }
                else document.querySelector('#credentialsCheck').style.visibility = 'visible';
            })
            .catch(err => {
                console.log('Login API error: ' + err);
            });
    }
    tryLogIn = async (user, pass) => {
        const response = await fetch('https://safe-dawn-48616.herokuapp.com/login/' + user + '/' + pass);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.error)
        }
        return body;
    };
    signUpHandler() {
        this.props.nav('/signUp');
    }
    clearErrorHandler() {
        document.querySelector('#credentialsCheck').style.visibility = 'hidden';
    }
    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ margin: '2% 10% 2% 55%', width: '20%', height: '100%', border: '2px solid black' }}>
                    <div style={{ margin: '10%', display: 'flex', flexDirection: 'column' }}>
                        <input type='text' name='user' placeholder='Username' style={{ margin: '10% 10% 0% 10%' }} onChange={this.clearErrorHandler}></input>
                        <input type='password' name='pass' placeholder='Password' style={{ margin: '10% 10% 0% 10%' }} onChange={this.clearErrorHandler}></input>
                        <p id='credentialsCheck' style={{ visibility: 'hidden' }}>* Invalid username or password *</p>
                        <button style={{ margin: '10% 10% 0% 10%' }} onClick={this.logInHandler}>Log In</button>
                        <p style={{ textAlign: 'center', margin: '0% 0% 4% 0%' }}>__________________________________________</p>
                        <button style={{ margin: '0% 10% 10% 10%' }} onClick={this.signUpHandler}>Sign Up</button>
                    </div>
                </div>
            </div>
        );
    }
}


const UserAuthContainer = connect(mapStateToProps, mapDispatchToProps)(UserAuthPanel);
function UserAuth() {
    let nav = useNavigate();
    return (
        <Provider store={store}>
            <UserAuthContainer nav={nav}></UserAuthContainer>
        </Provider>
    );
}
export default UserAuth;