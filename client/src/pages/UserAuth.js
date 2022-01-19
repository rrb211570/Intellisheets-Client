import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserAuth() {
    let nav = useNavigate();
    function logInHandler() {
        console.log('pair: ' + document.getElementsByName('user')[0].value + ' ' + document.getElementsByName('pass')[0].value);
        let user = document.getElementsByName('user')[0].value;
        let pass = document.getElementsByName('pass')[0].value;
        nav(`/sheets?user=${user}&pass=${pass}`);
    }
    function signUpHandler() {
        nav('/signUp');
    }
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ margin: '2% 10% 2% 55%', width: '20%', height: '100%', border: '2px solid black' }}>
                <div style={{ margin: '10%', display: 'flex', flexDirection: 'column' }}>
                    <input type='text' name='user' placeholder='Username' style={{ margin: '10% 10% 0% 10%' }}></input>
                    <input type='text' name='pass' placeholder='Password' style={{ margin: '10% 10% 0% 10%' }}></input>
                    <button style={{ margin: '10% 10% 0% 10%' }} onClick={logInHandler}>Log In</button>
                    <p style={{ textAlign: 'center', margin: '0% 0% 4% 0%' }}>__________________________________________</p>
                    <button style={{ margin: '0% 10% 10% 10%' }} onClick={signUpHandler}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}
export default UserAuth;