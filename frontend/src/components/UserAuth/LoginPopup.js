import '../../css/Home.css';
import { useState, useContext, useEffect } from 'react';
import GoogleLogin from './GoogleLogin';
import axios from 'axios';
import { authContext } from '../contexts/authContext';
import Error from './Error';
import { validateLoginForm } from './validate';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';



/*
 Needs: 
    -Google sign-in api implementation
    -regex for email/pass
*/
function Login(props) {
    const history = useHistory();
    const { authState, setAuthState } = useContext(authContext);
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [err, setErr] = useState();
    const REST_API_CALL = 'http://localhost:8080/api/login'
    const [emailerr, setEmailerr] = useState();
    const [pwerr, setPwerr] = useState();

    function updateEmail(e) {
        setEmail(e.target.value)
    }

    function updatePass(e) {
        setPass(e.target.value);
    }

    function submit(e) {
        var payload = {
            email: email,
            password: pass,
        };
        var result = validateLoginForm(payload);
        setEmailerr(result.errors.email);
        setPwerr(result.errors.password);
        console.log(result);
        e.preventDefault();
        if (result.success === true) {
            axios.post(REST_API_CALL, [email, pass]).then(async (resp) => {
                console.log(resp);
                if (resp.data.successful === true) { // The user already exists and has successfully logged in
                    console.log('Login Success: currentUser:', resp.data);
                    setAuthState(prevState => { return { ...prevState, showLogin: false, loggedIn: true, user: resp.data } });
                    history.push("./");
                } else { // The user does not already exist or some other error occured. Refer to error message to determine next steps
                    console.log('error: ' + resp.data.error);
                    if (resp.data.error == 'googleuser')
                        setErr('A Google account already exists with this email. Use Google sign-on.');
                    else
                        setErr("wrong email or password");
                }
            }).catch(err => {
                setErr(err.message);
            });
        }
    }
    return (
        <div className='login-popup'>
            <div style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '1em' }}>Log in</div>
            <div style={{ marginTop: '1em' }}><GoogleLogin LoggedinStatus={authState.loggedIn} buttonText={"Login to Salstock with Google"} signUporLogin={'Login'} /></div>
            <form className='login-form' onSubmit={submit}>
                <TextField
                    size='medium'
                    placeholder='email...'
                    margin='dense'
                    name="email"
                    label="email"
                    onChange={updateEmail}
                    error={emailerr}
                    helperText={emailerr ? emailerr : ''}
                />
                <br></br>
                <TextField
                    type='password'
                    size='medium'
                    placeholder='password...'
                    onChange={updatePass}
                    margin='dense'
                    name="pass"
                    label="password"
                    error={pwerr}
                    helperText={pwerr ? pwerr : ''}
                />
                <br></br>
                {err ? <Error errorMsg={err}></Error> : null}
                <br></br>
                <Button style={{ width: '20%', marginTop: '3em', fontWeight: 'bold' }} className='login-btn' size="small" type="submit" variant="contained" >Log in</Button>
            </form>
        </div>
    );
}

export default Login;