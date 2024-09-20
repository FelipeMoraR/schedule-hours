import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { IAuthContextType } from '../interfaces/props';
import verifyCookie from '../utils/VerifyCookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateOnlyNumberLetters, validateMaxLengthInput, validateMinLengthInput } from '../utils/InputValidator.tsx';
import removeCookie from '../utils/RemoveCookie.ts';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

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

const fetchLogoutUser = async (token:string, url: string) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        
        const data = await response.json(); // Here extract the body of the response
        
        if (data.status !== 200){
            console.error('Error ' + data.status + ' in the response, ' + data.message);
            return data.status
        }
        
        return data.status
    }
    catch(err: any){
        console.error(err);
        return 500
    }
}

const fetchLoginUser = async (url: string, bodyReq: string) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', //This allow fetch work with cookies
            body: bodyReq
        });
        
        const data = await response.json(); // Here extract the body of the response
        
        if (data.status !== 200){
            console.error('Error ' + data.status + ' in the response, ' + data.message);
            return data
        }
        
        return data
    }
    catch(err: any){
        console.error(err);
        return 500
    }
}

const AuthProvider = ({children}: {children: ReactNode}) => {
    const [errorLoged, setLogedError] = useState<string>('');
    const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);
    const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
    const [isLoadingVerifyCookie, setIsLoadingVerifyCookie] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    
    const changeAuthenticationFalse = () => {
        setIsAuthenticated(false);
    }

    const verfyToken = async () => {
        setIsLoadingVerifyCookie(true);
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/verify-token';
        
        if(!url.includes('/auth/api/verify-token')){
            console.error('Bad url');
            setIsLoadingVerifyCookie(false);
            setIsAuthenticated(false);
            return false
        }

        const token = await verifyCookie();
       
        if(!token){
            console.error('Token not found');
            setIsLoadingVerifyCookie(false);
            setIsAuthenticated(false);
            return false
        }
        

        const isValid = await fetchVerifyToken(token, url);
        
        if(!isValid){
            console.error('Invalid Token');
            await removeCookie(); //This will remove the cookie when the token is not valid.
            setIsAuthenticated(false);
            setIsLoadingVerifyCookie(false);
            
            return false
        }

        
        setIsAuthenticated(true);
        setIsLoadingVerifyCookie(false);
        return true

       
    }

    const handleLogOut = async () => {
        const token = await verifyCookie();
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/logout-user';
    
        if(!token){
            console.error('userToken not found');
            return false
        }

        const statusLogoutUser = await fetchLogoutUser(token, url);

        if(statusLogoutUser === 200){
            navigate('/');
            return true
        }

        return false
    }
    

    const login = async (username: string, password: string) => {
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/login-user';
        
        setIsLoadingLogin(true);

        const formatUsernameIsValid = validateOnlyNumberLetters(username);
        const maxLengthUsernameIsValid = validateMaxLengthInput(username, 10);
        const minLengthUsernameIsValid = validateMinLengthInput(username, 4);

        const maxLengthPasswordIsValid = validateMaxLengthInput(password, 9);
        const minLengthPasswordIsValid = validateMinLengthInput(password, 9);

        if(!formatUsernameIsValid){
            setLogedError('Username inserted is not valid, special characters or spaces cannot be used');
            setIsLoadingLogin(false); //When you change a hook too fast react dont considerate this change and just mantein the value.
            return
        }

        if(!maxLengthUsernameIsValid){
            setLogedError('Username inserted is too long');
            setIsLoadingLogin(false);
            return
        }

        if(!maxLengthPasswordIsValid){
            setLogedError('Password inserted is too long');
            setIsLoadingLogin(false);
            return
        }

        if(!minLengthUsernameIsValid){
            setLogedError('Username inserted is too short');
            setIsLoadingLogin(false);
            return
        }

        if(!minLengthPasswordIsValid){
            setLogedError('Password inserted is too short');
            setIsLoadingLogin(false);
            return
        }

        const bodyReq = JSON.stringify({
            username: username,
            password: password
        });

        try{
            const responseLogin = await fetchLoginUser(url, bodyReq);   
            
            if(responseLogin.status !== 200){
                setIsLoadingLogin(false);
                setIsAuthenticated(false);
                setLogedError(responseLogin.message);
                return
            }    

            setLogedError('');
            setIsLoadingLogin(false);
            setIsAuthenticated(true);
            navigate(from, {replace: true});
            return
        }
        catch(err){
            setIsLoadingLogin(false);
            console.error('There is an error' + err);
            return
        }
    }

    const logout = async () => {
        setIsLoadingLogout(true);
        const statusLogout = await handleLogOut();
        
        if(!statusLogout){
            setIsLoadingLogout(false);
            console.error('Something went wrong in the logout');
            return
        }

        setIsLoadingLogout(false);
        setIsAuthenticated(false);
    }

    const value = {
        errorLoged,
        isLoadingLogin,
        isLoadingLogout,
        isLoadingVerifyCookie,
        isAuthenticated,
        login,
        logout,
        changeAuthenticationFalse
    };
    
    useEffect(() => {
        
        const checkTokenLoged = async () => {
            try{
                await verfyToken();
                
                return
            }
            catch(err){
                console.error('Something went wrong ' + err);
            }
        }
        
        
        checkTokenLoged();
    }, [  ]);

    
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


const useAuthContext = (): IAuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { AuthProvider, useAuthContext }