import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/authContext';
import { IPrivateRouteProps } from '../interfaces/props';
import { useEffect, useState } from 'react';

function  PrivateRoute({ element }: IPrivateRouteProps) {
    const { isAuthenticated, isLoadingVerifyCookie } = useAuthContext(); //isLoadingVerifyCookie arrive false the first time, this controll global 
    const [ isLoadingPrivate, setIsLoadingPrivate] = useState<boolean>(true); //This controll the local 
    const location = useLocation(); //This extract the actual url where the user is.
    
    useEffect(() => {
        if(!isLoadingVerifyCookie){
            setIsLoadingPrivate(false); //This is for the page is reloaded but with the f5.
        }
    }, [ isLoadingVerifyCookie, isLoadingPrivate, isAuthenticated ]);

    if(isLoadingPrivate || isLoadingVerifyCookie){
        return(
            <div>ESTA CARGANDOOO</div>
        )
    }

    return isAuthenticated ? (
        element
    ) : (
        <Navigate to = "/login-user" state = {{ from: location }} /> //state helps to save the address(url) from where the user came and when he logs into the page we can use that info to redirect him previus page he was trying to join the first time.
    );
}

export default PrivateRoute;