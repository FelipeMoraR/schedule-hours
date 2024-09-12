import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { IAuthContextType } from '../interfaces/props';
import verifyCookie from '../utils/VerifyCookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { regexOnlyNumberLetters, maxLengthInput, minLengthInput } from '../utils/InputValidator';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);


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
    const [isLogedContext, setIsLoged] = useState<boolean>(false);
    const [errorLoged, setLogedError] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    
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
        const formatUsernameIsValid = regexOnlyNumberLetters(username);
        const maxLengthUsernameIsValid = maxLengthInput(username, 10);
        const maxLengthPasswordIsValid = maxLengthInput(password, 9);
        const minLengthUsernameIsValid = minLengthInput(username, 4);
        const minLengthPasswordIsValid = minLengthInput(password, 9);

        if(!formatUsernameIsValid){
            setLogedError('Username inserted is not valid, special characters or spaces cannot be used');
            return
        }

        if(!maxLengthUsernameIsValid){
            setLogedError('Username inserted is too long');
            return
        }

        if(!maxLengthPasswordIsValid){
            setLogedError('Password inserted is too long');
            return
        }

        if(!minLengthUsernameIsValid){
            setLogedError('Username inserted is too short');
            return
        }

        if(!minLengthPasswordIsValid){
            setLogedError('Password inserted is too short');
            return
        }

        const bodyReq = JSON.stringify({
            username: username,
            password: password
        });

        try{
            const responseLogin = await fetchLoginUser(url, bodyReq);   
            if(responseLogin.status !== 200){
                setIsLoged(false);
                setLogedError(responseLogin.message);
                return
            }    
            
            setIsLoged(true);
            navigate(from, {replace: true});
            return
        }
        catch(err){
            console.error('There is an error' + err);
            return
        }
    }

    const logout = async () => {
        const statusLogout = await handleLogOut();
        
        if(!statusLogout){
            console.error('Something went wrong in the logout');
            return
        }
        setIsLoged(false);
    }

    const value = {
        isLogedContext,
        errorLoged,
        login,
        logout
    };

    useEffect(() => {
        const checkTokenLoged = async () => {
            try{
                const tokenExist = await verifyCookie();

                if (tokenExist) {
                    setIsLoged(true);
                } else {
                    setIsLoged(false);
                }
            }
            catch(err){
                console.error('Something went wrong ' + err);
            }
        }
        
        setLogedError('');
        checkTokenLoged();
    }, []);
    
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