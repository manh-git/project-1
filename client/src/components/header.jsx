import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser, fetchUserSession } from './redux/auth_reducer'; 
import { FaHome, FaUserCircle, FaKey, FaQuestion, FaClone, FaSignOutAlt } from 'react-icons/fa';
import './styles/result.css'; 


export default function AppHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const { isAuthenticated, user, status, sessionChecked } = useSelector(state => state.auth || {});
    
    useEffect(() => {
        if (!sessionChecked && status === 'idle') {
            dispatch(fetchUserSession());
        }
    }, [dispatch, sessionChecked, status]);

    const displayName = user?.UserName || user?.username;

    function handleLogout() {
        dispatch(logoutUser());
        setShowDropdown(false);
        navigate('/');
    }
    
    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    return (
        <header className='fl-header'>
            <Link className="return" to="/">
                <FaHome size={20} style={{ marginRight: '8px' }} />
                <span>Home</span>
            </Link>

            {isAuthenticated ? (
                <div className="user-Infor-wrapper" ref={dropdownRef}>
                    <div className="userId-icon" onClick={toggleDropdown}>
                        <FaUserCircle size={40} style={{ verticalAlign: 'middle', cursor: 'pointer' }} />
                    </div>

                    {showDropdown && (
                        <div className="user-dropdown-popup">
                            <div className="dropdown-username">
                                Hello, {displayName}
                            </div>
                            <Link to="/changePassword" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                               <FaKey style={{ marginRight: '10px' }} />
                                Change Password
                            </Link>
                            
                            <Link to="/quiz/start" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                                <FaQuestion size={20} style={{ marginRight: '10px' }} />
                                Quiz
                            </Link>
                            <Link to="/learn" className="dropdown-menu-item" onClick={() => setShowDropdown(false)}>
                                <FaClone style={{ marginRight: '10px' }} />
                                Flashcard
                            </Link>

                            <div className="dropdown-logout" onClick={handleLogout}>
                                <FaSignOutAlt style={{ marginRight: '10px' }} />
                                Exit
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className='auth-links'>
                    <Link to="/login" className="header-link">Log In </Link>
                    <Link to="/signup" className="header-link"> Sign Up</Link>
                </div>
            )}
        </header>
    );
}