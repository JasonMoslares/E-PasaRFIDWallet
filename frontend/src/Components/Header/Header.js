import { Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../../API";

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogOut = () => {
        handleLogout(navigate);
    }

    let headerRightContent;
    
    if(user){
        headerRightContent = (
            <>
                <span>Hi, {user.name}</span>
                <button type='button' className='logOutButton' onClick={handleLogOut}>Log Out</button>
            </>
        )
    }
    else{
        headerRightContent = (
            <>
                <Link to='/register'>Register</Link>
                <Link to='/'>Log In</Link>
            </>
        )
    }

    return(
        <header>
            <div className='header-title'>
                <h2>E-Pasa</h2>
            </div>
            <div className="header-right-content">
                {headerRightContent}
            </div>
        </header>
    );
}

export default Header