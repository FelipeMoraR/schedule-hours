import { useState, useEffect } from "react";
import verifyCookie from "../utils/VerifyCookie";
import { useLocation } from "react-router-dom";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const location = useLocation();
    
    const fetchVerifyToken = async (token: string, url: string) => {
        try{
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json(); // Here extract the body of the response
            
            
            if (data.status !== 200){
                console.error('Error in the response');
                return false
            }
            
            return true
        }
        catch(err: any){
            console.error(err);
            return false
        }
    }



    const verfyToken = async () => {
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/verify-token';
        
        if(!url.includes('/auth/api/verify-token')){
            setError('Bad url');
            setIsLoading(false);
            setIsAuthenticated(false);
            return
        }

        const token = await verifyCookie();

        if(!token){
            setError('Token not found');
            setIsLoading(false);
            setIsAuthenticated(false);
            return
        }
        
        const isValid = await fetchVerifyToken(token, url);
        
        if(!isValid){
            setError('Invalid Token');
            setIsAuthenticated(false);
            setIsLoading(false);
            return
        }

        setIsAuthenticated(true);
        setIsLoading(false);
        return

       
    }

    useEffect(() => {
        verfyToken();
    }, [location]); 

    
    return { isAuthenticated, isLoading, error};
}