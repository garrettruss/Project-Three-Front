import { login, logout } from '../../services/firebase';
import "./Header.css";

const Header = (props) => (
    <header>
        <h1>Peak Bagger Log</h1>
         <ul>
            {
                props.user ?
                <>
                    <li> Welcome, {props.user.displayName}! You are logged in with {props.user.email}</li>
                    <li><img src={props.user.photoURL} alt={props.user.displayName} /></li>
                    <li className="auth-link" onClick={logout}>Logout</li>
                </>
                :
                <li className="auth-link" onClick={login}>Welcome, please login to continue!</li>
            }
        </ul>
    </header>
); 

export default Header;