import Button from '../../components/Button/Button';
import React from "react";
import handlerNavigationNavBar from '../../utils/HandlerNavigationNavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/authContext';

// Leer una cookie

function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthContext();
    const location = useLocation();

    const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = event.target as HTMLButtonElement;
        handlerNavigationNavBar(id, navigate);
    }

    return(
        <>
            <nav>
                Este es el navbar
                <Button
                    id = 'home'
                    text = 'HOME'
                    type = 'button'
                    classes = {location.pathname === '/' ? ['blocked'] : ['']}
                    onClick = {handleButton}
                />

                {
                    !isAuthenticated ? (
                        <>
                            <Button
                                id = 'loginUser'
                                text = 'LOGIN'
                                type = 'button'
                                classes = {location.pathname === '/login-user' ? ['blocked'] : ['']}
                                onClick = {handleButton}
                            />

                            <Button
                                id = 'registerUser'
                                text = 'Register'
                                type = 'button'
                                classes = {location.pathname === '/register-user' ? ['blocked'] : ['']}
                                onClick = {handleButton}
                            />  
                        </>
                    ) : null
                }

                {
                    isAuthenticated ? (
                        <>
                            <Button
                                id = 'logout'
                                text = 'LOGOUT'
                                type = 'button'
                                classes = {['']}
                                onClick = {logout}
                            />

                            <Button 
                                id = 'profileUser'
                                text = 'Profile'
                                type = 'button'
                                classes = {location.pathname === '/profile-user' ? ['blocked'] : ['']}
                                onClick = {handleButton}
                            /> 
                        </>
                    ) : null
                }
            </nav>
        </>
    )
}

export default NavBar;