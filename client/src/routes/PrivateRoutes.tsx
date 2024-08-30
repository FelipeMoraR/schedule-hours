import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PrivateRouteProps } from '../interfaces/props';
import { useEffect, useState } from 'react';



function PrivateRoute({ element }: PrivateRouteProps) {

    //Temporally
    const divStyle = {
        backgroundColor: 'red',
        height: '500px',
        width: '500px'
    }

    const { isAuthenticated, isLoading } = useAuth();
    const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
    const location = useLocation();

    useEffect(() => {
        if(!isLoading){
            setIsLoadingAuth(false);
        }
    }, [isLoading]);

    if(isLoadingAuth){
        return (
            <div style={divStyle}>Loading...</div>
        )
    }

    return isAuthenticated ? (
        element
    ) : (
        <Navigate to = "/" state = {{ from: location }} />
    );
}

export default PrivateRoute;