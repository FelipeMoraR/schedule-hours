import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { IAuthContextType } from '../interfaces/props';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateOnlyNumberLetters, validateMaxLengthInput, validateMinLengthInput } from '../utils/InputValidator.tsx';
import removeCookie from '../utils/RemoveCookie.ts';
import fetchRefreshToken from '../utils/FetchRefreshCookie.ts';
import fetchVerifyToken from '../utils/FetchVerifyToken.ts';
import { useModal } from '../utils/UseModal.ts';
import Modal from '../components/Modal/Modal.tsx';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);



const fetchLogoutUser = async (url: string) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

const fetchLoginUser = async (bodyReq: string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/login-user';

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
        return {status: 500, message: err}
    }
}

const fetchGetUser = async () => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const url = apiUrl + '/auth/api/get-user-info';

    try{
        const response = await fetch(url, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'

        });

        const result = await response.json();
        if (result.status === 200){
            return result.data;
        }
        
        return null 
    } catch (err) {
        console.error('Something went wrong ' + err);
        return null
    }
}

const AuthProvider = ({children}: {children: ReactNode}) => {
    const [errorLoged, setLogedError] = useState<string>('');
    const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);
    const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
    const [isLoadingVerifyCookie, setIsLoadingVerifyCookie] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isFromOtherPage, setIsFromOtherPage] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>(null);
    const { closeModal } = useModal();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    
    const handleIsFromOtherPage = () => {
        setIsFromOtherPage(true);
    }

    const handleErrorLoged = (value: string) => {
        setLogedError(value);
    }   

    const verfyToken = async () => {
        setIsLoadingVerifyCookie(true);
        
        const isValid = await fetchVerifyToken();
        
        if(isValid === null){
            setIsAuthenticated(false);
            setIsLoadingVerifyCookie(false);
            return false
        }

        if(isValid === false){
            await removeCookie();
            setIsAuthenticated(false);
            setIsLoadingVerifyCookie(false);
            return false
        }

        console.log('Token valid');
        setIsAuthenticated(true);
        setIsLoadingVerifyCookie(false);
        return true
    }

    const handleLogOut = async () => {
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/logout-user';
    
        const statusLogoutUser = await fetchLogoutUser(url);
        
        if(statusLogoutUser === 200){
            setUserData(null);
            navigate('/');
            return true
        }

        return false
    }
    
    const login = async (username: string, password: string) => {
        setIsLoadingLogin(true);

        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
            const responseLogin = await fetchLoginUser(bodyReq);   
            
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
        await fetchRefreshToken(); //This prevents errors when the token expired and the refresh token still alive.
        await handleLogOut();
        
        setIsLoadingLogout(false);
        setIsAuthenticated(false);
    }


    const checkTokenLoged = async () => {
        try{
            
            setIsLoadingVerifyCookie(true);
            
            if(isFromOtherPage){
                setIsFromOtherPage(false);
            }

            await new Promise(resolve => setTimeout(resolve, 500)); //To controll the petitions to the backend.
            
            const statusRefreshToken = await fetchRefreshToken();
            
            //With those if we control de petitions of the backend to optimized resources.
            if(statusRefreshToken){
                setIsAuthenticated(true);  
            } 

            if(!statusRefreshToken && isAuthenticated){ 
                await verfyToken(); 
            }

            setIsLoadingVerifyCookie(false);
        }
        catch(err){
            console.error('Something went wrong ' + err);
            return
        }
    }


    const localGetUser = async () => {
        if(isAuthenticated){
            const dataUser = await fetchGetUser();
            if(dataUser !== null){
                console.log(dataUser);
                setUserData(dataUser);
            }
                
        }
    }

    const value = {
        errorLoged,
        isLoadingLogin,
        isLoadingLogout,
        isLoadingVerifyCookie,
        isAuthenticated,
        userData,
        login,
        logout,
        handleIsFromOtherPage,
        handleErrorLoged
    };
    

    useEffect(() => {
        checkTokenLoged();    
    }, [location]);

    useEffect(() => {
        localGetUser();
    }, [isAuthenticated]);


    if(isLoadingVerifyCookie) {
        return(
            <Modal
                id = 'loaderLogin'
                type = 'loader'
                title = 'Loading verify cookie'
                isOpen = {true}
                classes = {['modal-loader-grey']}
                onClose={closeModal}
            />
        )
    }

    if(isAuthenticated && !userData){
        return(
            <Modal
                id = 'loaderLogin'
                type = 'loader'
                title = 'Loading user data'
                isOpen = {true}
                classes = {['modal-loader-grey']}
                onClose={closeModal}
            />
        )
    }

    if(isFromOtherPage){
        return
    }
    
    console.log('contex rendered');

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