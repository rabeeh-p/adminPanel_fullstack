import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice"; 

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const accessToken = useSelector((state) => state.user.accessToken);
    const userRole = useSelector((state) => state.user.userRole); 
    console.log(userRole,'rolee header');
    
    console.log(accessToken,'header');

    const handleLogoClick = () => {
        if (userRole === "superuser") {
            navigate("/adminhome");  
        } else {
            navigate("/userhome");  
        }
    };
    

    const headerStyles = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#4CAF50",
        padding: "10px 20px",
        color: "white",
        fontFamily: "'Arial', sans-serif",
    };

    const logoStyles = {
        display: "flex",
        alignItems: "center",
    };

    const logoTextStyles = {
        fontSize: "24px",
        fontWeight: "bold",
        marginLeft: "10px",
    };

    const buttonStyles = {
        padding: "10px 20px",
        backgroundColor: "#fff",
        color: "#4CAF50",
        border: "1px solid #4CAF50",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "background-color 0.3s, color 0.3s",
    };

    const buttonHoverStyles = {
        backgroundColor: "#45a049",
        color: "#fff",
    };

    const handleLogout = () => {
        dispatch(logout());
        console.log('is worked');
        
        navigate("/");
    };

    return (
        <header style={headerStyles}>
            <div style={logoStyles} onClick={handleLogoClick}>
                <span style={logoTextStyles}>MyApp</span>
            </div>
            {accessToken ? (
                <button
                    onClick={handleLogout}
                    style={buttonStyles}
                >
                    Logout
                </button>
            ) : (
                <button
                    onClick={() => navigate('/signup')}
                    style={buttonStyles}
                >
                    Sign Up
                </button>
            )}
        </header>
    );
};

export default Header;
