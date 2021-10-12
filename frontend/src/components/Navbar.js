import { NavLink, withRouter } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from './contexts/authContext';

import '../css/Navbar.css';

function Navbar(props) {
    // *Need to set toggleLogin* as a required prop later.
    const { authState, setAuthState } = useContext(authContext);

    function logout() {
        setAuthState(prevState => { return { ...prevState, loggedIn: false, user: {} } });
    }

    function action() {
        setAuthState(prevState => {
            return {
                ...prevState,
                display: null
            }
        });
    }
    if (authState.loggedIn === false) {
        return (
            <div className={'navbar '}>
                <div className='navbar-left'>
                    <NavLink className='navlink' exact to='/' onClick={action}>SALSTOCKS</NavLink>
                </div>
                <div className='navbar-right' style={{ whiteSpace: 'noWrap' }}>
                    <NavLink className='navlink' exact to='/' onClick={action}>Home/Search</NavLink>
                    <NavLink className='navlink' exact to='/Auth'>Login/Signup</NavLink>
                </div>
            </div>
        )
    }
    else if (authState.loggedIn === true) {
        return (
            <div className={'navbar '}>
                <div className='navbar-left'>
                    <NavLink className='navlink' exact to='/' onClick={action}>SALSTOCKS</NavLink>
                </div>
                <div className='navbar-right' style={{ whiteSpace: 'noWrap' }}>
                    <NavLink className='navlink' exact to='/' onClick={action}>Home/Search</NavLink>
                    <NavLink className='navlink' exact to='/Favorite'>Favorite</NavLink>
                    <NavLink className='navlink' exact to='/Port'>Portfolio</NavLink>
                    <div className='navlink' style={{ display: "inline-block" }} onClick={logout}>Log out</div>
                </div>
            </div>
        )
    }
}

export default withRouter(Navbar);