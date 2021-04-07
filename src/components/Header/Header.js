import { login, logout } from '../../services/firebase';

const Header = (props) => (
    <header>
        <h1>Peak Baggers Log</h1>
        <ul>
            {
                props.user ?
                <>
                    <li>Welcome, {props.user.displayName}</li>
                    <li><img src={props.user.photoURL} alt={props.user.displayName} /></li>
                    <li onClick={logout}>Logout</li>
                </>
                :
                <li onClick={login}>Login</li>
            }
        </ul>
    </header>
); 

export default Header;