import Button from '../../components/Button/Button';
import React from "react";
import handlerNavigationNavBar from '../../utils/HandlerNavigationNavBar';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/authContext';

// Leer una cookie

function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthContext();
    

    const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = event.target as HTMLButtonElement;
        handlerNavigationNavBar(id, navigate);
    }



    return(
        <>

            <nav>
                Este es el navbar
                <Button
                    id = 'goHome'
                    text = 'HOME'
                    type = 'button'
                    classes = {['']}
                    onClick = {handleButton}
                />

                {
                    !isAuthenticated ? (
                        <>
                            <Button
                                id = 'goLogin'
                                text = 'LOGIN'
                                type = 'button'
                                classes = {['']}
                                onClick = {handleButton}
                            />

                            <Button
                                id = 'goRegister'
                                text = 'Register'
                                type = 'button'
                                classes = {['']}
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
                                id = 'goProfile'
                                text = 'Profile'
                                type = 'button'
                                classes = {['']}
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