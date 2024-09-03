import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { IPrivateRouteProps } from '../interfaces/props';
import { useEffect, useState } from 'react';



function PrivateRoute({ element }: IPrivateRouteProps) {

    const { isAuthenticated, isLoading, error } = useAuth();
    const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
    const location = useLocation(); //This extract the actual url where the user is.

    useEffect(() => {
        if(!isLoading){
            setIsLoadingAuth(false);
        }
    }, [isLoading]);

    if(isLoadingAuth){
        return (
            <div>Loading...</div>
        )
    }

    if(error === 'Bad url' || error === 'Token not found'){
        return(
            <div>Error: {error}</div>
        )
    }

    return isAuthenticated ? (
        element
    ) : (
        <Navigate to = "/login-user" state = {{ from: location }} /> //state helps to save the address(url) from where the user came and when he logs into the page we can use that info to redirect him previus page he was trying to join the first time.
    );
}

export default PrivateRoute;