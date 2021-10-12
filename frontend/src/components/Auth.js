import Login from './UserAuth/LoginPopup'
import '../css/Home.css';
import Navbar from './Navbar';
import Signup from './UserAuth/SignupPopup'

function Auth() {

    return (
        <div className="Auth">
            <Navbar />
            <Login />
            <Signup />
        </div>

    )
}

export default Auth;