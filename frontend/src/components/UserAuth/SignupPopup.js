import '../../css/Home.css';
import { useState, useContext, useEffect } from 'react';
import GoogleLogin from './GoogleLogin';
import axios from 'axios';
import onClickOutside from 'react-onclickoutside'
import { authContext } from '../contexts/authContext';
import Error from './Error';
import { validateSignUpForm } from './validate';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const clickOutsideConfig = {
    handleClickOutside: () => Signup.handleClickOutside
};
function Signup(props) {
    const history = useHistory();
    const { authState, setAuthState } = useContext(authContext);
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [pwconfirm, setpwconfirm] = useState();
    const [err, setErr] = useState();
    const REST_API_CALL = 'http://localhost:8080/api/signup'
    const [emailerr, setEmailerr] = useState();
    const [pwerr, setPwerr] = useState();
    const [pwconfirmerr, setpwce] = useState();

    useEffect(() => {
        if (authState.signUpredirect === true) {
            setErr('Your google account is not registered, please sign up with google first');
            setAuthState(prevState => { return { ...prevState, signUpredirect: false } });
        }
    });


    Signup.handleClickOutside = (e) => {
        setAuthState(prevState => { return { ...prevState, showSignup: false } });
    };

    function updateEmail(e) {
        setEmail(e.target.value)
    }

    function updatePass(e) {
        setPass(e.target.value);
    }

    function updatepwconfirm(e) {
        setpwconfirm(e.target.value);
    }

    function submit(e) {
        var payload = {
            email: email,
            password: pass,
            pwconfirm: pwconfirm,
        };
        console.log(payload);
        var result = validateSignUpForm(payload);
        setEmailerr(result.errors.email);
        setPwerr(result.errors.password);
        setpwce(result.errors.pwconfirm);
        console.log(result);
        e.preventDefault();
        if (result.success === true) {
            axios.post(REST_API_CALL, [email, pass]).then(async (resp) => {
                console.log(resp);
                if (resp.data.successful === true) { // The user already exists and has successfully logged in
                    console.log('Signup Success: currentUser:', resp.data);
                    setAuthState(prevState => { return { ...prevState, showSignup: false, loggedIn: true, user: resp.data } });
                    history.push("./");
                } else { // The user does not already exist or some other error occured. Refer to error message to determine next steps
                    console.log('error: ' + resp.data.error);
                    setErr(resp.data.error);
                }
            }).catch(err => {
                console.log(err.message);
                setErr(err.message);
            });
        }
    }
    return (
        <div className='Signup-popup'>
            <div style={{ fontWeight: 'bold', fontSize: '30px', marginTop: '1em', }}>Sign up to SALSTOCK</div>
            <form className='Signup-form' onSubmit={submit}>
                <TextField
                    size='medium'
                    placeholder='apple@orange.com....'
                    margin='dense'
                    name="email"
                    label="email"
                    onChange={updateEmail}
                    error={emailerr}
                    helperText={emailerr ? emailerr : 'your email here'}
                />
                <br></br>
                <TextField
                    type='password'
                    size='medium'
                    placeholder='Password...'
                    onChange={updatePass}
                    margin='dense'
                    name="pass"
                    label="password"
                    error={pwerr}
                    helperText={pwerr ? pwerr : 'at least 8 characters'}
                />
                <br></br>
                <TextField
                    className='Signup-form input'
                    type='password'
                    size='medium'
                    placeholder='confirm your pass...'
                    onChange={updatepwconfirm}
                    margin='dense'
                    name='pwconfirm'
                    label="confirm password"
                    error={pwconfirmerr}
                    helperText={pwconfirmerr ? pwconfirmerr : 'enter your password to confirm'}
                />
                <br></br>
                {err ? <Error errorMsg={err}></Error> : null}
                <br></br>
                <Button style={{ width: '20%', marginTop: '3em' }} className='Signup-btn' size="small" type="submit" variant="contained" color="">Sign up</Button>
            </form>
        </div>
    );
}

export default onClickOutside(Signup, clickOutsideConfig);