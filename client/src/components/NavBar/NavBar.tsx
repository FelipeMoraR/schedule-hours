import Button from '../../components/Button/Button';
import React from "react";
import handlerNavigationNavBar from '../../utils/HandlerNavigationNavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/authContext';
import NavBarButtomsAuth from './NavBarButtomsAuth';

function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, logout, userData, handleIsFromOtherPage } = useAuthContext();
    const location = useLocation();
    const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = event.target as HTMLButtonElement;
        
        handleIsFromOtherPage();
        handlerNavigationNavBar(id, navigate);
    }


    
    if(!isAuthenticated){
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

                        <NavBarButtomsAuth
                            isAuthenticated = {isAuthenticated}
                            handleButton = {handleButton}
                        />
                </nav>
            </>
        )
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

                <NavBarButtomsAuth
                    isAuthenticated = {isAuthenticated}
                    handleButton = {handleButton}
                    logout = {logout}
                    typeUser = {userData.id_type_user}
                />

                {
                    isAuthenticated ? (
                        <>
                            {
                                userData.id_type_user === 1 ? (
                                    <h1>Admin</h1>
                                ) : null
                            }

                            {
                                userData.id_type_user === 2 ? (
                                    <h1>estudiante</h1>
                                ) : null
                            }

                            {
                                userData.id_type_user === 3 ? (
                                    <h1>Profe</h1>
                                ) : null
                            }
                        </>
                    ) : null
                }
            </nav>
        </>
    )
}

export default NavBar;