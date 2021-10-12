import { useState, useContext, useEffect } from 'react';
import GoogleLoginReact from 'react-google-login';
import axios from 'axios';
import { authContext } from '../contexts/authContext';
import { useHistory } from 'react-router-dom';



function GoogleLogin(props) {
    const { authState, setAuthState } = useContext(authContext)
    const history = useHistory();
    const REST_API_CALL_Login = 'http://localhost:8080/api/googlelogin'
    const REST_API_CALL_Signup = 'http://localhost:8080/api/googlesignup'
    var signUporLogin = null; // 'signup' or 'Login'
    const clientid = "467227431315-qfa0plniiro21687j2ifupq82cd7j6op.apps.googleusercontent.com";


    useEffect(() => {
        signUporLogin = props.signUporLogin;
    });

    function toggleLoginStatusOn() {
        setAuthState(prevState => { return { ...prevState, showLogin: false, loggedIn: true } });
    }
    const refreshTokenSetup = (res) => {
        // Timing to renew access token
        let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

        const refreshToken = async () => {
            const newAuthRes = await res.reloadAuthResponse();
            refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
            console.log('newAuthRes:', newAuthRes);
            // saveUserToken(newAuthRes.access_token);  
            setAuthState(prevState => { return { ...prevState, googleToken: newAuthRes.access_token } }); //< --save new token
            localStorage.setItem('authToken', newAuthRes.id_token);
            // Setup the other timer after the first one
            setTimeout(refreshToken, refreshTiming);
        };

        // Setup first refresh timer
        setTimeout(refreshToken, refreshTiming);
    };

    const onSuccess = (res) => {
        console.log('success');
        var id_token = res.getAuthResponse().id_token;
        console.log(id_token);
        // Post to the backend to check if the user currently exists or if they need to set up their account
        if (signUporLogin === 'Login') {
            axios.post(REST_API_CALL_Login, id_token).then(resp => {
                if (resp.data.successful === true) { // The user already exists and has successfully logged in
                    console.log('Login Success: currentUser:', resp);
                    toggleLoginStatusOn();
                    setAuthState(prevState => { return { ...prevState, googleToken: id_token, user: resp.data, showLogin: false } });
                    history.push("./");
                    refreshTokenSetup(res);
                } else { // The user does not already exist and needs to be redirected to the signup page
                    console.log('User must be redirected to signup page')
                    setAuthState(prevState => { return { ...prevState, signUpredirect: true, showLogin: false, showSignup: true } });
                }
            })
        }
        else if (signUporLogin === 'Signup') {
            axios.post(REST_API_CALL_Signup, id_token).then(resp => {
                if (resp.data.successful === true) { // The user has successfully registered with google
                    console.log('Signup Success: currentUser:', resp);
                    toggleLoginStatusOn();
                    setAuthState(prevState => { return { ...prevState, googleToken: id_token, user: resp.data, showSignup: false } });
                    refreshTokenSetup(res);
                } else { // The user already exist and needs to be redirected to the login page
                    console.log('User must be redirected to login page')
                    setAuthState(prevState => { return { ...prevState, Loginredirect: true, showLogin: true, showSignup: false } });
                }
            })
        }

    };


    const onFailure = (res) => {
        console.log(authState.loggedIn)
        console.log('Login failed: res:', res);
    };

    return (
        <GoogleLoginReact
            clientId={clientid}
            buttonText={props.buttonText}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
        />
    )
}

export default GoogleLogin;