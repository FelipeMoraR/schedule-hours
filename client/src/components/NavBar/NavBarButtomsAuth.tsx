import Button from "../Button/Button";
import { INavBarBtn } from "../../interfaces/props";
import { useLocation } from "react-router-dom";

const NavBarButtomsAuth = ({isAuthenticated, handleButton, logout, typeUser} : INavBarBtn) => {
    const location = useLocation();

    if(!isAuthenticated){
        return(
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
        )
    }
    return (
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

            {
                typeUser != 2 ? (
                    <Button 
                        id = 'createClass'
                        text = 'Crear clase'
                        type = 'button'
                        classes = {location.pathname === '/create-class' ? ['blocked'] : ['']}
                        onClick = {handleButton}
                    /> 
                ) : null
            }
            
            <Button 
                id = 'allClasses'
                text = 'Clases'
                type = 'button'
                classes = {location.pathname === '/all-classes' ? ['blocked'] : ['']}
                onClick = {handleButton}
            /> 

            <Button 
                id = 'yourClasses'
                text = {typeUser != 2 ? 'Clases creadas' : 'Tus clases'}
                type = 'button'
                classes = {location.pathname === '/your-classes' ? ['blocked'] : ['']}
                onClick = {handleButton}
            /> 
        </>
    );
}

export default NavBarButtomsAuth;