import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Provider, connect, useSelector } from 'react-redux';
import { store, mapStateToProps, mapDispatchToProps } from '../store.js'
import rootURL from '../serverURL.js';

class UserAuthPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.signUpHandler = this.signUpHandler.bind(this);
        this.loginHandler = this.loginHandler.bind(this);
    }
    render() {
        return (
            <div style={{ height: '100vh', width: '100vw', display: 'grid', grid: '1fr 7fr 1fr/ 1fr 1fr 2fr 305px 1fr ' }}>
                <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
                    <h1 style={{ color: 'gray', fontFamily: 'Century Gothic' }}>Intellisheets</h1>
                </div>
                <div style={{ backgroundColor: '#FFFCF0', gridColumn: '4 / 5', gridRow: '2 / 3', border: '8px solid black', borderRadius: '42px' }}>
                    <img src='flower2.jpg' style={{ position: 'absolute', zIndex: '-1', top: '200px', left: '0px', width: '366px', height: '471px' }} />
                    <img src='flower3.jpg' style={{ position: 'absolute', zIndex: '-1', top: '400px', width: '400px', height: '414px' }} />
                </div>
                <div style={{ backgroundColor: 'white', margin: '12px', gridColumn: '4 / 5', gridRow: '2 / 3', border: '2px solid black', borderRadius: '30px' }}>
                    <div style={{ margin: '10%', display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ textAlign: 'center' }}>Welcome!</h1>
                        <input id='userInput' type='text' placeholder='Username' style={{ margin: '10% 10% 0% 10%' }} onChange={this.clearErrorHandler}></input>
                        <input id='passInput' type='password' placeholder='Password' style={{ margin: '10% 10% 0% 10%' }} onChange={this.clearErrorHandler}></input>
                        <p id='credentialsCheck' style={{ visibility: 'hidden' }}>* Invalid username or password *</p>
                        <button id='login' className='navButton' style={{ margin: '10% 10% 0% 10%' }} onClick={this.loginHandler}>Log In</button>
                        <hr style={{ width: '100%', border: 'solid 1px #E3E3E3' }} />
                        <button id='signup' className='navButton' style={{ margin: '0% 10% 10% 10%' }} onClick={this.signUpHandler}>Sign Up</button>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        document.querySelector('#login').setAttribute('disabled', 'disabled');
        document.querySelector('#signup').setAttribute('disabled', 'disabled');
        this.checkTokenAPI()
            .then(res => {
                console.log(res);
                if (res.status == 'success') this.props.nav('/sheets');
                else {
                    document.querySelector('#login').removeAttribute('disabled');
                    document.querySelector('#signup').removeAttribute('disabled');
                }
            })
            .catch(err => {
                console.log('checkToken API error: ' + err);
                document.querySelector('#login').removeAttribute('disabled');
                document.querySelector('#signup').removeAttribute('disabled');
            })
    }
    checkTokenAPI = async () => {
        const response = await fetch(rootURL + 'checkToken/', { credentials: 'include' });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.error);
        return body;
    }
    loginHandler() {
        let user = document.querySelector('#userInput').value;
        let pass = document.querySelector('#passInput').value;
        console.log('clicked');
        document.querySelector('#login').setAttribute('disabled', 'disabled');
        document.querySelector('#signup').setAttribute('disabled', 'disabled');
        this.loginAPI(user, pass)
            .then(res => {
                console.log(res);
                if (res.status == 'success') this.props.nav('/sheets');
                else {
                    document.querySelector('#credentialsCheck').style.visibility = 'visible';
                    document.querySelector('#login').removeAttribute('disabled');
                    document.querySelector('#signup').removeAttribute('disabled');
                }
            })
            .catch(err => {
                console.log('Login API error: ' + err);
                document.querySelector('#login').removeAttribute('disabled');
                document.querySelector('#signup').removeAttribute('disabled');
            });
    }
    loginAPI = async (user, pass) => {
        const response = await fetch(rootURL + 'login/' + user + '/' + pass, { credentials: 'include' });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.error);
        return body;
    };
    signUpHandler() {
        this.props.nav('/signUp');
    }
    clearErrorHandler() {
        document.querySelector('#credentialsCheck').style.visibility = 'hidden';
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