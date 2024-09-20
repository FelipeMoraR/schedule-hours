import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/authContext';
import { IPrivateRouteProps } from '../interfaces/props';
import { useEffect, useState } from 'react';
import verifyCookie from '../utils/VerifyCookie';
import decodeJWT from '../utils/decodeJWT';
import removeCookie from '../utils/RemoveCookie.ts';

const handleDecodeJWT = async () =>{
    const token = await verifyCookie();
    const decodeToken = decodeJWT(token);
    const currentDate = new Date();

    if(!decodeToken){
        console.error('Token does not exist');
        return null
    }

    const timeMs = new Date(decodeToken.exp * 1000); //Time in miliseconds
    
    if(currentDate > timeMs){
        console.error('Token invalid');
        return false
    } 
    console.info('Valid');
    return true
}

function  PrivateRoute({ element }: IPrivateRouteProps) {
    const { isAuthenticated, isLoadingVerifyCookie, changeAuthenticationFalse } = useAuthContext(); //isLoadingVerifyCookie arrive false the first time, this controll global 
    const [ isLoadingPrivate, setIsLoadingPrivate] = useState<boolean>(true); //This controll the local 
    const [ isLoadingToken, setIsLoadingToken] = useState<boolean>(true); //This controll the local 
    const [ tokenIsValid, setTokenIsValid ] = useState<boolean | null>(null);
    const location = useLocation(); //This extract the actual url where the user is.
    
    useEffect(() => {
        console.log('isAuthenticated =>', isLoadingVerifyCookie)
        const asyncHandleDecodeJWT = async () => {
            const statusToken = await handleDecodeJWT();
            
            setTokenIsValid(statusToken);
            setIsLoadingToken(false);
        } 

        if(!isLoadingVerifyCookie){
            setIsLoadingPrivate(false); //This is for the page is reloaded but with the f5.
        }
    
        if(isLoadingPrivate || isLoadingVerifyCookie){
            return //If still loading return
        }

        if (!isLoadingPrivate && !isLoadingVerifyCookie) { //if both end to load will execute this code.
            
            if(tokenIsValid === false){
                removeCookie();
                changeAuthenticationFalse();
                setTokenIsValid(null); //we remove the cookie so this has to be null to not enter again in the if statement
                return
            }

            if(tokenIsValid === true){
                return
            }

            if(isAuthenticated){ //Controll the fetch to optimitation.
                asyncHandleDecodeJWT();
            } else {
                setIsLoadingToken(false);
                setTokenIsValid(null);
            }
        }  
    }, [ isLoadingVerifyCookie, isLoadingPrivate, isAuthenticated, tokenIsValid ]);

    

    if(isLoadingPrivate || isLoadingVerifyCookie || isLoadingToken){
        return(
            <div>ESTA CARGANDOOO</div>
        )
    }

    if(tokenIsValid == null){
        console.error('Token does not exist... Redirecting...');
        return (
            <Navigate to = "/login-user" state = {{ from: location }} />
        )
    }

    

    return isAuthenticated ? (
        element
    ) : (
        <Navigate to = "/login-user" state = {{ from: location }} /> //state helps to save the address(url) from where the user came and when he logs into the page we can use that info to redirect him previus page he was trying to join the first time.
    );
}

export default PrivateRoute;